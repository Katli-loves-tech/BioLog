-- BioLog database schema
-- Run this against your Aiven PostgreSQL instance to create the tables
-- that Entity Framework Core expects.

CREATE EXTENSION IF NOT EXISTS vector;

-- ── Employees ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employee (
    employeenumber  TEXT PRIMARY KEY,
    firstname       TEXT NOT NULL,
    lastname        TEXT NOT NULL,
    idnumber        TEXT NOT NULL,
    position        TEXT,
    department      TEXT,
    contactnumber   TEXT,
    email           TEXT,
    gender          TEXT,
    facevector      VECTOR(512),
    isactive        BOOLEAN NOT NULL DEFAULT TRUE,
    createdat       TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- ── Attendance Logs ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendancelog (
    id              SERIAL PRIMARY KEY,
    employeenumber  TEXT NOT NULL,
    timestamp       TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    logtype         TEXT NOT NULL,
    starttime       TIME,
    endtime         TIME,
    graceperiodmins INTEGER NOT NULL DEFAULT 15
);

-- ── Security Alerts ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS securityalert (
    id              SERIAL PRIMARY KEY,
    employeenumber  TEXT,
    alerttype       TEXT NOT NULL,
    message         TEXT,
    snapshoturl     TEXT,
    isresolved      BOOLEAN NOT NULL DEFAULT FALSE,
    createdat       TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- ── Admins / Portal Users ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin (
    id              SERIAL PRIMARY KEY,
    employeenumber  TEXT,
    passwordhash    TEXT NOT NULL,
    fullname        TEXT NOT NULL,
    role            TEXT NOT NULL,
    isactivated     BOOLEAN NOT NULL DEFAULT FALSE,
    createdat       TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
