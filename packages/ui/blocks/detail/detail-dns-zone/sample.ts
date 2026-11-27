import type { DnsZoneDetailRecord, DnsZoneDetailZone } from './detail-dns-zone.vue'

export const sampleZone: DnsZoneDetailZone = {
  name: 'main-zone',
  domain: 'example.com',
  dnssec: true,
  active: true,
  nameservers: ['ns1.example.net', 'ns2.example.com', 'ns3.example.org'],
  dnssecKey: {
    keyTag: '34505',
    algorithm: '13 (ECDSA Curve P-256 with SHA-256)',
    digestType: '2 (SHA-256)',
    digest: '8A9E1F2C3B4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F'
  }
}

export const sampleRecords: DnsZoneDetailRecord[] = [
  {
    id: '423916',
    name: 'www',
    type: 'A',
    value: '192.0.2.1',
    ttl: 3600,
    policy: 'simple',
    weight: 255,
    description: 'Points www at the origin server.'
  }
]

export const sampleZoneFile = `$ORIGIN example.com.
$TTL 1h
@       IN SOA ns1.example.net. admin.example.com. ( 2026111101 7200 3600 1209600 3600 )
@       IN NS  ns1.example.net.
@       IN A   192.0.2.10
www     IN CNAME example.com.
api 300 IN A   192.0.2.300
mail    IN MX  10 mx.example.net.
@       IN TXT "v=spf1 include:_spf.example.net ~all"
ipv6    IN AAAA 2001:db8::10
legacy  IN HINFO "PC" "Linux"`
