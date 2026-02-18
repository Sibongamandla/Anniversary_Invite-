import sqlite3

def add_column():
    db_path = "wedding.db"
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if column exists
        cursor.execute("PRAGMA table_info(guests)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if "sunset_surprise_attendance" not in columns:
            print("Adding sunset_surprise_attendance column...")
            cursor.execute("ALTER TABLE guests ADD COLUMN sunset_surprise_attendance BOOLEAN DEFAULT 0")
            conn.commit()
            print("Column added successfully.")
        else:
            print("Column already exists.")
            
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_column()
