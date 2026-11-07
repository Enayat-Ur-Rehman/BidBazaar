#!/bin/bash
set -eux
dnf install -y iptables-nft

cat > /usr/local/sbin/nat-setup.sh <<'EOF'
#!/bin/bash
set -eux
sysctl -w net.ipv4.ip_forward=1
IFACE=$(ip route show default | awk '{print $5; exit}')
iptables -t nat -C POSTROUTING -o "$IFACE" -j MASQUERADE 2>/dev/null || iptables -t nat -A POSTROUTING -o "$IFACE" -j MASQUERADE
iptables -P FORWARD ACCEPT
EOF
chmod +x /usr/local/sbin/nat-setup.sh

# Re-apply NAT rules on every boot (instances may be stopped/started to save cost).
cat > /etc/systemd/system/nat-setup.service <<'EOF'
[Unit]
Description=Enable NAT for private subnets
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/nat-setup.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now nat-setup.service
