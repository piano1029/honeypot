// Helper for parsing the needed information from the auth log file

import fs from 'fs'

export type AuthLogEntry = {
    date: Date
    ip: string
    user: string
}

export function parseAuthLog(path: string): AuthLogEntry[] {
    const contents = fs.readFileSync(path, 'utf8')
    const lines = contents.split('\n')
    const entries: AuthLogEntry[] = []

    for (const line of lines) {
        if (line.includes("Disconnected from authenticating user")) { // This is the line containing ip, user, date and service
            const parts = line.split(' ')
            const date = new Date(parts[0] + ' ' + parts[1] + ' ' + parts[2])
            // Part 3 is the server's hostname btw
            const service = parts[4].split('[')[0]
            const user = parts[9]
            const source = parts[10]

            console.log(date, service, user, source)
        }
    }

    return entries
}