# Yurin - Discord Bot Source Code (WIP)
[![wakatime](https://wakatime.com/badge/user/e2f38306-a530-4264-be7e-838d855f9182/project/16e0e736-6c32-4af4-afe3-11e3f4d889f4.svg)](https://wakatime.com/badge/user/e2f38306-a530-4264-be7e-838d855f9182/project/16e0e736-6c32-4af4-afe3-11e3f4d889f4) [![Known Vulnerabilities](https://snyk.io/test/github/yumiruuwu/Yurin-Bot-Source-Code/badge.svg)](https://snyk.io/test/github/yumiruuwu/Yurin-Bot-Source-Code) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/d45bf290f635470490910eec57429502)](https://www.codacy.com/gh/yumiruuwu/Yurin-Bot-Source-Code/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=yumiruuwu/Yurin-Bot-Source-Code&amp;utm_campaign=Badge_Grade) [![GitHub license](https://img.shields.io/github/license/yumiruuwu/Yurin-Bot-Source-Code?style=flat-square)](https://github.com/yumiruuwu/Yurin-Bot-Source-Code/blob/master/LICENSE)

##### Created by Mykm & replicanya

# Hold up!!!
## Don't clone this repo yet, it won't work right now.

## About this bot:
- This bot can be used for moderating your server and yes, music commands included but still in beta.
- This bot doesn't include any fun or game commands so wait for next update (if i'm not lazy)
- Currently this bot have 27 Slash Commands (include Sub-commands), 2 user commands & 2 prefix commands.

## Requirements
- Any Text Editor (e.g VSC, Sublime Text,...)
- Install [ffmpeg](https://www.ffmpeg.org)
- MongoDB URL ([How to setup](https://youtu.be/4X2qsZudLNY))

## How to use
- Clone this repo: `git clone https://github.com/yumiruuwu/Yurin-Bot-Source-Code.git`
- Use `npm init` to re-config `package.json`
- Edit `config.json` with your information (if you upload this code to public, make sure add this file to `.gitignore` before upload)
- Use `npm i` to install all required package

## I'm done so what's next?
Yes, this bot mainly use slash commands to function so here another how to use:
1. Register/Unregister Slash to Global:
    - To register, simply use `node register` and check your bot in Discord
    - To unregister, use `node unregister` and wait about one hour according to [discordjs](https://discordjs.guide/interactions/registering-slash-commands.html#global-commands)
2. Register/Unregister Slash to the specific guild: **(recommend if you want to test or edit commands)**
    - To register, use `node register` with Server ID. Example: `node register 222078108977594368`
    - To unregister, use `node unregister` with Server ID. Example: `node unregister 222078108977594368`
> Thanks to [this project](https://github.com/DankMemer/sniper) for inspiring me a new way to register Slash.

## Final Step:
It's done!!

## Report Errors:
- Feel free to create an issue ticket and I will try to fix it or you can fix it yourself :joy:

Srry for my bad english :sweat_smile: