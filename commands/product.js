const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, Colors, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Pfad zur JSON-Datei
const productsFilePath = path.join(__dirname, '../config/Mods/products.json');

module.exports = {
    data: [
        new SlashCommandBuilder()
            .setName('cp')
            .setDescription('Create a product embed with a form')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('mp')
            .setDescription('Send an embed with product management buttons')
            .toJSON()
    ],

    async handleCommand(interaction) {
        if (interaction.commandName === 'cp') {
            const productModal = new ModalBuilder()
                .setCustomId('productModal')
                .setTitle('Produkt-Embed erstellen');

            const titleInput = new TextInputBuilder()
                .setCustomId('title')
                .setLabel('Titel der Embed')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const descriptionInput = new TextInputBuilder()
                .setCustomId('description')
                .setLabel('Beschreibung der Embed')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const colorInput = new TextInputBuilder()
                .setCustomId('color')
                .setLabel('Farbe der Embed (Hex-Code)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const channelIdInput = new TextInputBuilder()
                .setCustomId('channelId')
                .setLabel('Kanal-ID für die Embed')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            productModal.addComponents(
                new ActionRowBuilder().addComponents(titleInput),
                new ActionRowBuilder().addComponents(descriptionInput),
                new ActionRowBuilder().addComponents(colorInput),
                new ActionRowBuilder().addComponents(channelIdInput)
            );

            await interaction.showModal(productModal);
        } else if (interaction.commandName === 'mp') {
            const productEmbed = new EmbedBuilder()
                .setTitle('Product Management')
                .setDescription('Verwenden Sie die untenstehenden Schaltflächen, um Produkte zu verwalten.')
                .setColor(Colors.Blue)
                .setFooter({ text: 'Made By .gg/res-codes' });

            const buttonRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('add_product')
                        .setLabel('Add Product')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('remove_product')
                        .setLabel('Remove Product')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('edit_product')
                        .setLabel('Edit Product')
                        .setStyle(ButtonStyle.Primary)
                );

            await interaction.reply({ embeds: [productEmbed], components: [buttonRow], ephemeral: false });
        }
    },

    async handleModalSubmit(interaction) {
        if (interaction.customId === 'productModal') {
            await interaction.deferReply({ ephemeral: true });

            const title = interaction.fields.getTextInputValue('title');
            const description = interaction.fields.getTextInputValue('description');
            const color = convertColor(interaction.fields.getTextInputValue('color'));
            const channelId = interaction.fields.getTextInputValue('channelId');

            const channel = interaction.guild.channels.cache.get(channelId);
            if (!channel) {
                return interaction.editReply({ content: 'Kanal nicht gefunden.', ephemeral: true });
            }

            try {
                const productEmbed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(color)
                    .setFooter({ text: 'Made By .gg/res-codes' });

                const sentMessage = await channel.send({ embeds: [productEmbed] });

                // Speichere die Embed-Daten in products.json
                const productData = {
                    messageId: sentMessage.id,
                    channelId: channelId,
                    title: title,
                    description: description,
                    color: color,
                    products: []  // Initialisiere ein leeres Array für Produkte
                };

                saveProductData(productData);

                await interaction.editReply({ content: `Produkt-Embed erfolgreich im Kanal ${channel.name} erstellt und gespeichert!`, ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: 'Fehler beim Erstellen und Speichern der Embed.', ephemeral: true });
            }
        } else if (interaction.customId === 'addProductModal') {
            await interaction.deferReply({ ephemeral: true });

            const messageId = interaction.fields.getTextInputValue('messageId');
            const product = interaction.fields.getTextInputValue('product');
            const price = interaction.fields.getTextInputValue('price');

            // Lade die Produktdaten aus der JSON-Datei
            const productData = loadProductData(messageId);
            if (!productData) {
                return interaction.editReply({ content: 'Keine Produktdaten gefunden.', ephemeral: true });
            }

            const channel = interaction.guild.channels.cache.get(productData.channelId);
            if (!channel) {
                return interaction.editReply({ content: 'Kanal nicht gefunden.', ephemeral: true });
            }

            try {
                const message = await channel.messages.fetch(messageId);
                let embed = message.embeds[0];

                if (!embed) {
                    return interaction.editReply({ content: 'Keine Embed-Nachricht gefunden.', ephemeral: true });
                }

                // Umwandlung des eingebetteten Objekts in einen EmbedBuilder (falls es nicht bereits ist)
                embed = EmbedBuilder.from(embed);

                embed.addFields(
                    { name: product, value: `\`\`\`${price}\`\`\``, inline: true }
                );

                await message.edit({ embeds: [embed] });

                // Überprüfe, ob das `products`-Array existiert und initialisiere es gegebenenfalls
                if (!productData.products) {
                    productData.products = [];
                }

                // Aktualisiere die Produktdaten in der JSON-Datei
                productData.products.push({ product, price });
                saveProductData(productData);

                await interaction.editReply({ content: 'Produkt erfolgreich hinzugefügt und gespeichert!', ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: 'Fehler beim Bearbeiten der Nachricht.', ephemeral: true });
            }
        } else if (interaction.customId === 'removeProductModal') {
            await interaction.deferReply({ ephemeral: true });

            const messageId = interaction.fields.getTextInputValue('messageId');
            const productToRemove = interaction.fields.getTextInputValue('product');

            // Lade die Produktdaten aus der JSON-Datei
            const productData = loadProductData(messageId);
            if (!productData) {
                return interaction.editReply({ content: 'Keine Produktdaten gefunden.', ephemeral: true });
            }

            const channel = interaction.guild.channels.cache.get(productData.channelId);
            if (!channel) {
                return interaction.editReply({ content: 'Kanal nicht gefunden.', ephemeral: true });
            }

            try {
                const message = await channel.messages.fetch(messageId);
                let embed = message.embeds[0];

                if (!embed) {
                    return interaction.editReply({ content: 'Keine Embed-Nachricht gefunden.', ephemeral: true });
                }

                // Umwandlung des eingebetteten Objekts in einen EmbedBuilder (falls es nicht bereits ist)
                embed = EmbedBuilder.from(embed);

                // Filtere das zu entfernende Produkt heraus
                embed.data.fields = embed.data.fields.filter(field => field.name !== productToRemove);

                await message.edit({ embeds: [embed] });

                // Entferne das Produkt aus der JSON-Datei
                productData.products = productData.products.filter(p => p.product !== productToRemove);
                saveProductData(productData);

                await interaction.editReply({ content: 'Produkt erfolgreich entfernt!', ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: 'Fehler beim Entfernen des Produkts.', ephemeral: true });
            }
        } else if (interaction.customId === 'editProductModal') {
            await interaction.deferReply({ ephemeral: true });

            const messageId = interaction.fields.getTextInputValue('messageId');
            const oldProductName = interaction.fields.getTextInputValue('oldProductName');
            const newProductName = interaction.fields.getTextInputValue('newProductName');
            const newPrice = interaction.fields.getTextInputValue('newPrice');

            // Lade die Produktdaten aus der JSON-Datei
            const productData = loadProductData(messageId);
            if (!productData) {
                return interaction.editReply({ content: 'Keine Produktdaten gefunden.', ephemeral: true });
            }

            const channel = interaction.guild.channels.cache.get(productData.channelId);
            if (!channel) {
                return interaction.editReply({ content: 'Kanal nicht gefunden.', ephemeral: true });
            }

            try {
                const message = await channel.messages.fetch(messageId);
                let embed = message.embeds[0];

                if (!embed) {
                    return interaction.editReply({ content: 'Keine Embed-Nachricht gefunden.', ephemeral: true });
                }

                // Umwandlung des eingebetteten Objekts in einen EmbedBuilder (falls es nicht bereits ist)
                embed = EmbedBuilder.from(embed);

                // Bearbeite das Produkt
                const fieldIndex = embed.data.fields.findIndex(field => field.name === oldProductName);
                if (fieldIndex !== -1) {
                    embed.data.fields[fieldIndex].name = newProductName;
                    embed.data.fields[fieldIndex].value = `\`\`\`${newPrice}\`\`\``;
                } else {
                    return interaction.editReply({ content: 'Produkt nicht gefunden.', ephemeral: true });
                }

                await message.edit({ embeds: [embed] });

                // Aktualisiere das Produkt in der JSON-Datei
                const productIndex = productData.products.findIndex(p => p.product === oldProductName);
                if (productIndex !== -1) {
                    productData.products[productIndex] = { product: newProductName, price: newPrice };
                    saveProductData(productData);
                }

                await interaction.editReply({ content: 'Produkt erfolgreich bearbeitet!', ephemeral: true });
            } catch (error) {
                console.error(error);
                await interaction.editReply({ content: 'Fehler beim Bearbeiten des Produkts.', ephemeral: true });
            }
        }
    },

    async handleButtonInteraction(interaction) {
        if (interaction.customId === 'add_product') {
            const productModal = new ModalBuilder()
                .setCustomId('addProductModal')
                .setTitle('Produkt hinzufügen');

            const messageIdInput = new TextInputBuilder()
                .setCustomId('messageId')
                .setLabel('Message-ID der zu bearbeitenden Embed')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const productInput = new TextInputBuilder()
                .setCustomId('product')
                .setLabel('Produktname (z.B. Lifetime, 1 Year)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const priceInput = new TextInputBuilder()
                .setCustomId('price')
                .setLabel('Preis (z.B. 2.0€ / 3.0€)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            productModal.addComponents(
                new ActionRowBuilder().addComponents(messageIdInput),
                new ActionRowBuilder().addComponents(productInput),
                new ActionRowBuilder().addComponents(priceInput)
            );

            await interaction.showModal(productModal);
        } else if (interaction.customId === 'remove_product') {
            const removeProductModal = new ModalBuilder()
                .setCustomId('removeProductModal')
                .setTitle('Produkt entfernen');

            const messageIdInput = new TextInputBuilder()
                .setCustomId('messageId')
                .setLabel('Message-ID der zu bearbeitenden Embed')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const productInput = new TextInputBuilder()
                .setCustomId('product')
                .setLabel('Produktname zum Entfernen')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            removeProductModal.addComponents(
                new ActionRowBuilder().addComponents(messageIdInput),
                new ActionRowBuilder().addComponents(productInput)
            );

            await interaction.showModal(removeProductModal);
        } else if (interaction.customId === 'edit_product') {
            const editProductModal = new ModalBuilder()
                .setCustomId('editProductModal')
                .setTitle('Produkt bearbeiten');

            const messageIdInput = new TextInputBuilder()
                .setCustomId('messageId')
                .setLabel('Message-ID der zu bearbeitenden Embed')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const oldProductNameInput = new TextInputBuilder()
                .setCustomId('oldProductName')
                .setLabel('Alter Produktname')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const newProductNameInput = new TextInputBuilder()
                .setCustomId('newProductName')
                .setLabel('Neuer Produktname')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const newPriceInput = new TextInputBuilder()
                .setCustomId('newPrice')
                .setLabel('Neuer Preis')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            editProductModal.addComponents(
                new ActionRowBuilder().addComponents(messageIdInput),
                new ActionRowBuilder().addComponents(oldProductNameInput),
                new ActionRowBuilder().addComponents(newProductNameInput),
                new ActionRowBuilder().addComponents(newPriceInput)
            );

            await interaction.showModal(editProductModal);
        }
    }
};

// Hilfsfunktion zur Farbkonvertierung
function convertColor(colorInput) {
    const namedColors = {
        red: Colors.Red,
        blue: Colors.Blue,
        green: Colors.Green,
        yellow: Colors.Yellow,
        white: Colors.White,
        black: Colors.Black,
        purple: Colors.Purple,
        orange: Colors.Orange,
    };

    if (namedColors[colorInput.toLowerCase()]) {
        return namedColors[colorInput.toLowerCase()];
    }

    if (/^#[0-9A-F]{6}$/i.test(colorInput)) {
        return colorInput;
    }

    return Colors.White;
}

// Funktion zum Speichern von Produktdaten in der JSON-Datei
function saveProductData(productData) {
    let products = [];
    if (fs.existsSync(productsFilePath)) {
        const fileContent = fs.readFileSync(productsFilePath, 'utf8');
        products = JSON.parse(fileContent);
    }

    const existingIndex = products.findIndex(p => p.messageId === productData.messageId);
    if (existingIndex !== -1) {
        products[existingIndex] = productData;
    } else {
        products.push(productData);
    }

    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// Funktion zum Laden von Produktdaten aus der JSON-Datei
function loadProductData(messageId) {
    if (fs.existsSync(productsFilePath)) {
        const fileContent = fs.readFileSync(productsFilePath, 'utf8');
        const products = JSON.parse(fileContent);
        return products.find(p => p.messageId === messageId);
    }
    return null;
}
