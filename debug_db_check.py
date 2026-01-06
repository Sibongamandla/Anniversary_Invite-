import sqlite3

def check_db():
    try:
        conn = sqlite3.connect('wedding.db')
        cursor = conn.cursor()
        
        print("--- Guests Table ---")
        cursor.execute("SELECT id, name, unique_code, phone_number FROM guests")
        rows = cursor.fetchall()
        for row in rows:
            print(f"ID: {row[0]}, Name: {row[1]}, Code: '{row[2]}', Phone: {row[3]}")
            
        print("\n--- Check Specific Code 'DQTB6J' ---")
        cursor.execute("SELECT * FROM guests WHERE unique_code = 'DQTB6J'")
        match = cursor.fetchone()
        if match:
            print(f"Found match: {match}")
        else:
            print("No strict match found.")

        conn.close()
    except Exception as e:
        print(f"Error reading DB: {e}")

if __name__ == "__main__":
    check_db()
