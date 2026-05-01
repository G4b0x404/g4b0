---
title: DNS (53)
description: Enumeración DNS
---
### Descubrimiento de IP

```bash
dig +short hackthebox.com
```

### Subdominios

```bash
dnsenum --enum inlanefreight.com -f /usr/share/seclists/Discovery/DNS/subdomains-top1million-20000.txt -r
```

```bash
gobuster vhost -u http://inlanefreight.htb:81 -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt --append-domain
```

#### Certificates Transparency

```bash
curl -s "https://crt.sh/?q=facebook.com&output=json" | jq -r '.[] | select(.name_value | contains("dev")) | .name_value' | sort -u
```

### Zonas de Transferencia

```bash
dig axfr @nsztm1.digi.ninja zonetransfer.me
```

### Fingerprinting

```bash
curl -I https://www.inlanefreight.com
```

```bash
wafw00f inlanefreight.com
```

```bash
nikto -h inlanefreight.com -Tuning b
```

#### Crepy Crawlys

```bash
python3 ReconSpider.py http://inlanefreight.com
```

```bash
./finalrecon.py --headers --whois --url http://inlanefreight.com
```

