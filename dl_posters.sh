#!/bin/bash
set -e
cd /home/nick/standupcomedynyc/web/assets/posters
declare -A pairs=(
  ["michelle-buteau-2026-09-29.jpg"]="https://s1.ticketm.net/dam/a/122/f981ddc4-a193-4485-8334-f8fea14f3122_RETINA_PORTRAIT_3_2.jpg"
  ["the-moth-storyslam-2026-09-30.jpg"]="https://s1.ticketm.net/dam/a/275/0bf35f97-e51e-4ea7-a445-a91b987ec275_RETINA_PORTRAIT_3_2.jpg"
  ["brendan-scannell-abyss-2026-10-01.jpg"]="https://s1.ticketm.net/dam/e/a99/cdfa4ee3-653e-4b14-b2fa-90024591ca99_RETINA_PORTRAIT_3_2.jpg"
  ["nate-varrone-2026-10-01.jpg"]="https://s1.ticketm.net/dam/a/c58/4adef731-cf76-4163-8524-cd69983d4c58_RETINA_PORTRAIT_3_2.jpg"
  ["phoebe-robinson-2026-10-02.jpg"]="https://s1.ticketm.net/dam/a/bfc/61fd0437-0953-4bfd-ba08-abc1aede0bfc_RETINA_PORTRAIT_3_2.jpg"
  ["two-dykes-and-a-mic-2026-10-03.jpg"]="https://s1.ticketm.net/dam/e/a38/232ab589-7dc9-4024-8fab-91840ab49a38_RETINA_PORTRAIT_3_2.jpg"
  ["comedy-girl-autumn-2026-10-04.jpg"]="https://s1.ticketm.net/dam/a/e20/e071eded-09da-4e13-af24-cb0d5c438e20_RETINA_PORTRAIT_3_2.jpg"
  ["hot-butter-train-2026-10-05.jpg"]="https://s1.ticketm.net/dam/e/13c/90452af5-e883-46c0-9bf5-4ccda0c4513c_RETINA_PORTRAIT_3_2.jpg"
  ["joe-mande-2026-10-07.jpg"]="https://s1.ticketm.net/dam/e/812/ffad7231-b6c7-4af4-a5ff-f8be937a3812_RETINA_PORTRAIT_3_2.jpg"
  ["molly-kearney-2026-10-08.jpg"]="https://s1.ticketm.net/dam/a/9c4/8365ab22-ac7b-435b-bd2f-b538789169c4_RETINA_PORTRAIT_3_2.jpg"
  ["poly-diaz-2026-10-09.jpg"]="https://s1.ticketm.net/dam/a/46b/b02509bd-4380-43c8-b78d-f269a917446b_RETINA_PORTRAIT_3_2.jpg"
  ["maria-bamford-2026-10-10.jpg"]="https://s1.ticketm.net/dam/a/1bb/27e1dbf1-1e21-42f3-b3c3-0ff8dddcd1bb_RETINA_PORTRAIT_3_2.jpg"
  ["bechdel-cast-2026-10-12.jpg"]="https://s1.ticketm.net/dam/e/03b/a8ef6377-e56f-4a08-a69f-3f5f4cc9903b_RETINA_PORTRAIT_3_2.jpg"
  ["josh-aaron-improv-2026-10-14.jpg"]="https://s1.ticketm.net/dam/a/31f/29a43993-c94f-45dd-b8bb-1595baead31f_RETINA_PORTRAIT_3_2.jpg"
  ["francesca-mattlieb-2026-10-15.jpg"]="https://s1.ticketm.net/dam/e/499/9b807e4c-266f-49d3-a42e-805f0369a499_RETINA_PORTRAIT_3_2.jpg"
  ["blank-check-live-2026-10-16.jpg"]="https://s1.ticketm.net/dam/a/f85/a816c9f2-7600-4306-9466-44603dc06f85_RETINA_PORTRAIT_3_2.jpg"
  ["asif-ali-2026-10-17.jpg"]="https://s1.ticketm.net/dam/a/689/514bec4c-42ef-4165-92f8-1124365dd689_1827131_TABLET_LANDSCAPE_LARGE_16_9.jpg"
  ["johnny-pemberton-2026-10-18.jpg"]="https://s1.ticketm.net/dam/a/8c6/b5ca2bbb-31a4-46f6-81ae-c3ff040568c6_RETINA_PORTRAIT_3_2.jpg"
  ["michelle-buteau-2026-10-19.jpg"]="https://s1.ticketm.net/dam/a/122/f981ddc4-a193-4485-8334-f8fea14f3122_RETINA_PORTRAIT_3_2.jpg"
  ["david-cross-benefit-2026-10-20.jpg"]="https://s1.ticketm.net/dam/a/5ae/2418e6e7-712b-4099-906c-8f527e8c65ae_RETINA_PORTRAIT_3_2.jpg"
  ["brett-goldstein-2026-10-21.jpg"]="https://s1.ticketm.net/dam/a/fb8/f09abbd9-bcb8-4a09-83ab-c43806315fb8_RETINA_PORTRAIT_3_2.jpg"
  ["sydnee-washington-2026-10-23.jpg"]="https://s1.ticketm.net/dam/e/e03/46e9a769-0bee-4594-a96d-ba360fe71e03_RETINA_PORTRAIT_3_2.jpg"
)
for fn in "${!pairs[@]}"; do
  url="${pairs[$fn]}"
  if [ ! -s "$fn" ]; then
    curl -sSL -o "$fn" "$url" 2>/dev/null || echo "FAIL $fn"
  fi
  size=$(stat -c%s "$fn" 2>/dev/null || echo 0)
  echo "$fn: $size bytes"
done
