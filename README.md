
```
# Discord Bot

Ein einfacher Discord-Bot, der verschiedene Funktionen wie das Erstellen von Produkt-Embeds
und das Verwalten von Produkten bietet.

## Voraussetzungen

Bevor du den Bot verwenden kannst, stelle sicher, dass du folgende Voraussetzungen erfüllst:

- Node.js (v14 oder höher)
- Ein Discord-Bot-Token ([hier](https://discord.com/developers/applications) erstellen)
- Ein Discord-Server, auf dem du den Bot verwenden möchtest

## Installation

1. **Repository klonen:**

   ```bash
   git clone <repository-url>
   cd <repository-verzeichnis>
   ```

2. **Abhängigkeiten installieren:**

   Stelle sicher, dass du im Hauptverzeichnis des Projekts bist und führe dann folgenden Befehl aus:

   ```bash
   npm install
   ```

## Konfiguration

1. **Bot-Konfiguration:**

   Bearbeite die Datei `config.js` im Verzeichnis `config/bot/` und trage dein Bot-Token und die Client-ID ein:

   ```javascript
   module.exports = {
       token: 'dein-bot-token-hier',
       clientId: 'deine-client-id-hier',
   };
   ```

2. **Mod-Konfiguration:**

   In der Datei `mods.json` im Verzeichnis `config/mods/` kannst du die Rolle für Teammitglieder konfigurieren:

   ```json
   {
       "teamRoleId": "roleid"
   }
   ```

## Starten des Bots

1. **Bot starten:**

   Führe im Hauptverzeichnis folgenden Befehl aus:

   ```bash
   node index.js
   ```

   Wenn alles richtig konfiguriert ist, sollte der Bot starten und in der Konsole anzeigen, dass er online ist.

2. **Befehle registrieren:**

   Der Bot registriert automatisch alle Befehle beim Start. Stelle sicher, dass du die entsprechenden Slash-Befehle auf deinem Discord-Server verwenden kannst.

## Verwendung

### Befehle

Der Bot bietet verschiedene Befehle, die über Slash-Befehle in Discord verwendet werden können:

- `/cp`: Erstelle ein Produkt-Embed mit einem Formular.
- `/mp`: Sende ein Embed mit Schaltflächen zur Produktverwaltung.

### Beispiel zur Produktverwaltung

- **Produkt hinzufügen**: Verwende den entsprechenden Button im Verwaltungs-Embed, um ein Produkt hinzuzufügen.
- **Produkt entfernen**: Wähle das zu entfernende Produkt aus und bestätige.
- **Produkt bearbeiten**: Bearbeite den Namen oder Preis eines Produkts über das Verwaltungs-Embed.

## Fehlerbehebung

Falls Probleme auftreten:

1. Überprüfe, ob das Bot-Token und die Client-ID korrekt in der `config.js` Datei eingetragen sind.
2. Stelle sicher, dass der Bot über die richtigen Berechtigungen auf dem Discord-Server verfügt.
3. Überprüfe die Konsole auf Fehlermeldungen und behebe sie entsprechend.

## Mitwirken

Beiträge zu diesem Projekt sind willkommen. Erstelle bitte einen Pull-Request oder öffne ein Issue, wenn du Vorschläge oder Probleme hast.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Weitere Informationen findest du in der `LICENSE` Datei.
```
