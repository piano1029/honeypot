import fs from 'fs'
import { AuthLogEntry, parseAuthLog } from "./parse";

export function parseLogs(): AuthLogEntry[] {
    let hosts = fs.readdirSync('./auth_logs')
    let entries: AuthLogEntry[] = []

    for (const host of hosts) {
        entries = entries.concat(parseAuthLog('./auth_logs/' + host + '/var/log/auth.log'))
    }

    return entries
}