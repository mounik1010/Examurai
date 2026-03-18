USE examurai;

-- Drop tables if they exist (for a clean setup; remove these lines if you want to keep your data)
DROP TABLE IF EXISTS bookmarks;
DROP TABLE IF EXISTS papers;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    joined_date DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Papers table (NO year column)
CREATE TABLE papers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name varchar(50),
    user_id INT,
    college VARCHAR(255),
    course VARCHAR(255),
    semester INT,
    subject VARCHAR(255),
    filename VARCHAR(255),
    original_name VARCHAR(255),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookmarks table
CREATE TABLE bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    paper_id INT,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (paper_id) REFERENCES papers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create a new user (change the password to something secure)
CREATE USER 'examuraiuser'@'localhost' IDENTIFIED BY 'examuraipass';

-- Grant all privileges on the examurai database to this user
GRANT ALL PRIVILEGES ON examurai.* TO 'examuraiuser'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;