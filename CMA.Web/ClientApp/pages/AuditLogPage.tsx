
import React, { useState, useEffect, useMemo } from 'react';
import logService from '../services/logService.js';
import { LogEntry } from '../types.js';
import { useUser } from '../contexts/UserContext.js';

const AuditLogPage: React.FC = () => {
    const { currentUser } = useUser();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filterUser, setFilterUser] = useState('');
    const [filterAction, setFilterAction] = useState('');

    useEffect(() => {
        setLogs(logService.getLogs());
    }, []);
    
    const actionTypes = useMemo(() => {
        const allActions = logService.getLogs().map(log => log.action);
        return [...new Set(allActions)];
    }, []);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const userMatch = filterUser ? log.user.toLowerCase().includes(filterUser.toLowerCase()) : true;
            const actionMatch = filterAction ? log.action === filterAction : true;
            return userMatch && actionMatch;
        });
    }, [logs, filterUser, filterAction]);

    if (currentUser.role !== 'Admin') {
        return (
            <div className="text-center py-10 bg-glass backdrop-blur-lg border border-white/20 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-red-400 text-shadow">Access Denied</h1>
                <p className="text-gray-200 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white text-shadow mb-6">Audit Log</h1>
            
            <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="user-filter" className="block text-sm font-medium text-gray-200">Filter by User</label>
                        <input
                            id="user-filter"
                            type="text"
                            value={filterUser}
                            onChange={e => setFilterUser(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white/10 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-white placeholder-gray-400"
                            placeholder="Enter user name..."
                        />
                    </div>
                    <div>
                        <label htmlFor="action-filter" className="block text-sm font-medium text-gray-200">Filter by Action</label>
                        <select
                            id="action-filter"
                            value={filterAction}
                            onChange={e => setFilterAction(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white/10 border-white/30 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md text-white"
                        >
                            <option value="" className="text-black">All Actions</option>
                            {actionTypes.map(action => (
                                <option key={action} value={action} className="text-black">{action}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-glass backdrop-blur-lg border border-white/20 shadow-xl rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-white/10 border-b border-white/20">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Timestamp</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">User</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Role</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Action</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider text-shadow">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr key={log.id} className="border-b border-white/20 hover:bg-white/10 transition-colors">
                                <td className="px-5 py-4 text-sm bg-transparent text-gray-300 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-5 py-4 text-sm bg-transparent text-gray-100">{log.user}</td>
                                <td className="px-5 py-4 text-sm bg-transparent text-gray-200">{log.role}</td>
                                <td className="px-5 py-4 text-sm bg-transparent"><span className="px-2 py-1 font-semibold text-xs rounded-full bg-primary/70 text-white">{log.action}</span></td>
                                <td className="px-5 py-4 text-sm bg-transparent text-gray-100">{log.details}</td>
                            </tr>
                        ))}
                         {filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-300">No log entries match the current filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogPage;
