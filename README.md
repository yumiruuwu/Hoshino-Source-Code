# Hoshino - Discord Bot Source Code (WIP)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/64d575d1cf104c839a8229b51c99adfb)](https://app.codacy.com/gh/yumiruuwu/Hoshino-Source-Code?utm_source=github.com&utm_medium=referral&utm_content=yumiruuwu/Hoshino-Source-Code&utm_campaign=Badge_Grade_Settings)
[![Known Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/yumiruuwu/Yurin-Bot-Source-Code?style=flat-square)](https://snyk.io/test/github/yumiruuwu/Yurin-Bot-Source-Code) [![Codacy Badge](https://img.shields.io/codacy/grade/d45bf290f635470490910eec57429502?style=flat-square)](https://www.codacy.com/gh/yumiruuwu/Yurin-Bot-Source-Code/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=yumiruuwu/Yurin-Bot-Source-Code&amp;utm_campaign=Badge_Grade) [![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/yumiruuwu/Yurin-Bot-Source-Code?style=flat-square)](https://lgtm.com/projects/g/yumiruuwu/Yurin-Bot-Source-Code/context:javascript) [![GitHub license](https://img.shields.io/github/license/yumiruuwu/Yurin-Bot-Source-Code?style=flat-square)](https://github.com/yumiruuwu/Yurin-Bot-Source-Code/blob/master/LICENSE) [![CodeQL](https://github.com/yumiruuwu/Yurin-Bot-Source-Code/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/yumiruuwu/Yurin-Bot-Source-Code/actions/workflows/codeql-analysis.yml) [![GitHub Super-Linter](https://github.com/yumiruuwu/Yurin-Bot-Source-Code/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter) 

##### ~~Created by Mykm & replicanya~~ ATTENTION: This repo does not work anymore!!!

## About this bot:
- This bot can be used for moderating your server and yes, music commands included but still in beta.
- This bot doesn't include any fun or game commands so wait for next update (if i'm not lazy)
- Currently this bot have 27 Slash Commands (include Sub-commands), 2 user commands & 17 prefix commands.

## Note:
- This source code was write with javascript language (probably you already know it)
- The main language which bot will reply is Vietnamese so feel free to translate them to your preferred language.

## Requirements
- Node.js v17 or higher required
- Any Text Editor (e.g VSC, Sublime Text,...)
- Install [ffmpeg](https://www.ffmpeg.org)
- MongoDB URL ([How to setup](https://youtu.be/4X2qsZudLNY))

## How to use
- Clone this repo: `git clone https://github.com/yumiruuwu/Hoshino-Source-Code.git`
- After cloning this repo, please remove the **devDependencies** in `package.json` then close it
- Use `npm init` to re-config `package.json`
- Edit `config.json` with your information (next time if you're going to upload this code to public, make sure add this file to `.gitignore` before upload)
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
Enjoy!!

## Report Bugs/Errors:
- Feel free to create an issue ticket and I will try to fix it or you can fix it yourself :joy:

Srry for my bad english :sweat_smile:
