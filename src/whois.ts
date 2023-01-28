import whoiser, { WhoisSearchResult } from "whoiser";

export async function ip_whois(ip: string): Promise<WhoisSearchResult> {
    return await whoiser(ip);
}