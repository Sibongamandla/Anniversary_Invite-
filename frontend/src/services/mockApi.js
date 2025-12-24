// Mock API that mimics Axios but uses localStorage
// This allows the app to function offline/without a backend.

const mockApi = {
    // Utility to simulate network delay
    _delay: () => new Promise(resolve => setTimeout(resolve, 500)),

    // Helper to get data
    _getDb: () => {
        const stored = localStorage.getItem('mock_db_guests');
        return stored ? JSON.parse(stored) : [];
    },

    // Helper to save data
    _saveDb: (data) => {
        localStorage.setItem('mock_db_guests', JSON.stringify(data));
    },

    get: async (url, config = {}) => {
        await mockApi._delay();

        console.log(`[MockAPI] GET ${url}`);

        // Route: /guests/
        if (url === '/guests/') {
            return { data: mockApi._getDb() };
        }

        // Route: /rsvp/{code}
        if (url.startsWith('/rsvp/')) {
            const code = url.split('/rsvp/')[1];
            const guests = mockApi._getDb();
            const guest = guests.find(g => g.unique_code === code);

            if (guest) {
                return { data: guest };
            } else {
                // Return 404 mimicking axios error
                const error = new Error('Guest not found');
                error.response = { status: 404, data: { detail: 'Invalid invitation code' } };
                throw error;
            }
        }

        // Default 404
        throw new Error(`Mock endpoint ${url} not found`);
    },

    post: async (url, data, config = {}) => {
        await mockApi._delay();

        console.log(`[MockAPI] POST ${url}`, data);

        // Route: /token (Login)
        if (url === '/token' || url === '/token/') {
            return {
                data: {
                    access_token: "mock_token_12345",
                    token_type: "bearer"
                }
            };
        }

        // Route: /guests/ (Create Guest)
        if (url === '/guests/') {
            const guests = mockApi._getDb();

            // Generate Code
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            const newGuest = {
                id: Date.now(),
                unique_code: code,
                rsvp_status: 'pending',
                ...data
            };

            guests.push(newGuest);
            mockApi._saveDb(guests);

            return { data: newGuest };
        }

        // Route: /guests/upload-csv
        if (url === '/guests/upload-csv') {
            return { data: { message: "CSV Upload not supported in Offline Mode" } };
        }

        // Route: /rsvp/{code} (Submit RSVP)
        if (url.startsWith('/rsvp/')) {
            const code = url.split('/rsvp/')[1];
            const guests = mockApi._getDb();
            const index = guests.findIndex(g => g.unique_code === code);

            if (index !== -1) {
                // Update guest
                guests[index] = { ...guests[index], ...data };
                mockApi._saveDb(guests);
                return { data: guests[index] };
            } else {
                const error = new Error('Guest not found');
                error.response = { status: 404, data: { detail: 'Invalid invitation code' } };
                throw error;
            }
        }

        throw new Error(`Mock endpoint ${url} not found`);
    }
};

export default mockApi;
