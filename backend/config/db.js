import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../data/database.json");

const readDatabase = () => {
    try {
        const data = fs.readFileSync(dbPath, "utf-8");
        if (!data.trim()) {
            return { users: [], events: [], registrations: [] };
        }
        return JSON.parse(data);
    } catch (error) {
        return { users: [], events: [], registrations: [] };
    }
};

const writeDatabase = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

const generateId = (prefix) => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
};

export const db = {
    users: {
        find: () => {
            const data = readDatabase();
            return data.users;
        },

        findOne: (query) => {
            const data = readDatabase();
            return data.users.find(user => {
                return Object.keys(query).every(
                    key => user[key] === query[key]
                );
            });
        },

        findById: (id) => {
            const data = readDatabase();
            return data.users.find(
                user => user._id === id
            );
        },

        create: (userData) => {
            const data = readDatabase();
            const newUser = {
                _id: generateId("user"),
                ...userData,
                createdAt: new Date().toISOString()
            };
            data.users.push(newUser);
            writeDatabase(data);
            return newUser;
        }
    },

    events: {
        find: () => {
            const data = readDatabase();
            return data.events;
        },

        findById: (id) => {
            const data = readDatabase();
            return data.events.find(event => event._id === id);
        },

        create: (eventData) => {
            const data = readDatabase();
            const newEvent = {
                _id: generateId("event"),
                ...eventData,
                createdAt: new Date().toISOString()
            };
            data.events.push(newEvent);
            writeDatabase(data);
            return newEvent;
        },

        findByIdAndUpdate: (id, updates) => {
            const data = readDatabase();
            const index = data.events.findIndex(event => event._id === id);
            if (index === -1) return null;

            data.events[index] = { ...data.events[index], ...updates };
            writeDatabase(data);
            return data.events[index];
        },

        findByIdAndDelete: (id) => {
            const data = readDatabase();
            const index = data.events.findIndex(event => event._id === id);
            if (index === -1) return null;

            const deleted = data.events[index];
            data.events.splice(index, 1);
            writeDatabase(data);
            return deleted;
        }
    },

    registrations: {
        find: (filter) => {
            const data = readDatabase();
            if (!filter) return data.registrations;
            return data.registrations.filter(reg => {
                return Object.keys(filter).every(key => reg[key] === filter[key]);
            });
        },

        findOne: (query) => {
            const data = readDatabase();
            return data.registrations.find(reg => {
                return Object.keys(query).every(key => reg[key] === query[key]);
            });
        },

        countDocuments: (filter) => {
            const data = readDatabase();
            return data.registrations.filter(reg => {
                return Object.keys(filter).every(key => reg[key] === filter[key]);
            }).length;
        },

        create: (regData) => {
            const data = readDatabase();
            const newReg = {
                _id: generateId("reg"),
                ...regData,
                registeredAt: new Date().toISOString()
            };
            data.registrations.push(newReg);
            writeDatabase(data);
            return newReg;
        },

        findByIdAndDelete: (id) => {
            const data = readDatabase();
            const index = data.registrations.findIndex(reg => reg._id === id);
            if (index === -1) return null;

            const deleted = data.registrations[index];
            data.registrations.splice(index, 1);
            writeDatabase(data);
            return deleted;
        }
    }
};