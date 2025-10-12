
import { LogEntry, User } from '../types.js';

// In-memory log store
let logs: LogEntry[] = [];

// Seed with initial data for demonstration
const initialLogs: LogEntry[] = [
  {
    id: `log-${Date.now() - 100000}`,
    timestamp: new Date(Date.now() - 100000).toISOString(),
    user: 'Admin User',
    role: 'Admin',
    action: 'CREATE_EXAM',
    details: 'Created new exam: "Modern Physics Midterm"'
  },
  {
    id: `log-${Date.now() - 200000}`,
    timestamp: new Date(Date.now() - 200000).toISOString(),
    user: 'Admin User',
    role: 'Admin',
    action: 'CREATE_STUDENT',
    details: 'Created new student: "Emily Davis"'
  },
   {
    id: `log-${Date.now() - 300000}`,
    timestamp: new Date(Date.now() - 300000).toISOString(),
    user: 'Moderator User',
    role: 'Moderator',
    action: 'UPDATE_STUDENT',
    details: 'Updated details for student: John Doe (ID: 1)'
  },
];

logs = [...initialLogs];


const logService = {
  /**
   * Adds a new log entry to the in-memory store.
   * @param user The user performing the action.
   * @param action A capitalized, snake-cased string representing the action type.
   * @param details A human-readable description of the action.
   */
  addLog: (user: User, action: string, details: string): void => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user.name,
      role: user.role,
      action,
      details,
    };
    // Prepend new logs to show the most recent first
    logs = [newLog, ...logs];
  },

  /**
   * Retrieves all log entries.
   * @returns An array of all log entries.
   */
  getLogs: (): LogEntry[] => {
    return [...logs];
  },
};

export default logService;
