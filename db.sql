-- Database: Todos

CREATE DATABASE "Todos"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- postgres
CREATE TABLE logins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30),
  password VARCHAR(72)
);

-- sqlite3
CREATE TABLE logins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(30),
  password VARCHAR(72)
);

insert into logins (username, password) values ('success_login', 'success_password')

-- postgres
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id SERIAL,
  title VARCHAR(30),
  completed BOOLEAN,
  created_modified TEXT,
  constraint fk_user_id
  	foreign key(user_id)
	  references logins(id)
);

-- sqlite3
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title VARCHAR(30),
  completed BOOLEAN,
  created_modified TEXT,
  foreign key(user_id) references logins(id)
);

-- postgres
CREATE TABLE suggestions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30)
);

-- sqlite3
CREATE TABLE suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(30)
);

insert into suggestions (title) values ('buy milk')
insert into suggestions (title) values ('buy cheese')
insert into suggestions (title) values ('go to the gym')
insert into suggestions (title) values ('clean the house')
