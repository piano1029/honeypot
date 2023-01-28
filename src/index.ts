import { parseLogs } from "./logs";
import fs from 'fs'
import { WhoisSearchResult } from "whoiser";
import { AuthLogEntry } from "./parse";
import { ip_whois } from "./whois";

type IPInfo = {
    ip: string
    whois?: WhoisSearchResult,
    authLogEntries: AuthLogEntry[]
}

const ipInfo: Map<string, IPInfo> = new Map()

console.log(`Parsing logs...`);

; (async () => {
    if (process.env.TRUSTED_IPS === undefined) {
        console.error('TRUSTED_IPS environment variable is not set. Exiting...')
        process.exit(1)
    }

    const entries = parseLogs()

    // Filter out trusted IPs
    const trustedIps = process.env.TRUSTED_IPS.split(',')
    const filteredEntries = entries.filter(entry => !trustedIps.includes(entry.source))

    // Get the unique IPs
    const uniqueIps = [...new Set(filteredEntries.map(entry => entry.source))]
    console.log(`Found ${uniqueIps.length} unique IPs.`)

    // Get the IP info
    for (const ip of uniqueIps) {
        const whois = await ip_whois(ip).catch(err => {
            console.error(`Error getting whois info for ${ip}: ${err}`)
            return undefined
        })

        // Get all the auth log entries for the IP
        const authLogEntries = filteredEntries.filter(entry => entry.source === ip)

        ipInfo.set(ip, {
            ip,
            whois,
            authLogEntries
        })

        console.log(`Progress: ${ipInfo.size}/${uniqueIps.length}`)
    }

    console.log(`Writing to file...`)
    fs.writeFileSync('./ip_info.json', JSON.stringify([...ipInfo], null, 4))
})()