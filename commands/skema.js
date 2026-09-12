const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skema')
        .setDescription('Print vore skema')
        .addIntegerOption(Option => 
            Option.setName('dag')
            .setDescription('Hvilken dag af ugen i 0-4')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(4)
        )
        .addIntegerOption(Option =>
            Option.setName('uge')
            .setDescription('Hvilken uge (0-52)')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(52)
        )
        .addBooleanOption(option =>
            option.setName('ephemeral')
            .setDescription('Print til kun dig')
            .setRequired(false)
        ),
    async execute(interaction) {
        var ephe = interaction.options.getBoolean('ephemeral');
        if(ephe == null || ephe == undefined) ephe = true;
        const sent = await interaction.reply({ content: 'Finder skema', withResponse: true, ephemeral: ephe});
        
        try {
            var nowday = interaction.options.getInteger('dag');

            console.log(`nowday = ${nowday}`);

            if(nowday == undefined || nowday == null) {
                nowday = new Date().getDay();
                console.log(nowday);
                while(nowday == 5 || nowday == 6) {
                    nowday++;
                    if(nowday > 6) nowday = 0;
                }
                
            }

            Date.prototype.getWeek = function() {  // have to add getWeek()
                const date = new Date(this.getTime());
                date.setHours(0, 0, 0, 0);
                // Thursday in current week decides the year
                date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
                // January 4 is always in week 1
                const week1 = new Date(date.getFullYear(), 0, 4);
                // Adjust to Thursday in week 1 and count number of weeks from date to week1
                return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
            };

            var uge = interaction.options.getInteger('uge');

            if(uge == null || uge == undefined) {
                uge = new Date().getWeek()
            }

            console.log(`uge = ${uge}`);

            const skemajson = require(`../skemas//uge_${uge}.json`);
            var skema = `Uge: ${uge}\n\n`;

            const days = [
                "mandag ",
                "tirsdag",
                "onsdag ",
                "torsdag",
                "fredag "
            ];

            const day = days[nowday];
            var correctClasses = [];
            for(const k in skemajson.classes) {
                if(skemajson.classes[k].day.slice(0,7) != day) continue;
                correctClasses.push(k);
            }

            skema +=
            `***Dag: ${skemajson.classes[correctClasses[0]].day}***\n`;
            for(const i in correctClasses){
                if(skemajson.classes[correctClasses[i]].time != undefined){
                    skema += `    **Tid:** ${skemajson.classes[correctClasses[i]].time}\n`;
                    skema += `    **Fag:** ${skemajson.classes[correctClasses[i]].course.split(" - ")[2]}\n`;
                    skema += `    **Klasse:** ${skemajson.classes[correctClasses[i]].room}\n`
                    skema += `    **lektier:** ${skemajson.classes[correctClasses[i]].homework_notes}\n\n`
                }
            }



            //send result
            await interaction.editReply({content: skema});
        } catch (error) {
            console.log(error);
            await interaction.editReply({content: "There was an error"});
        }
    }
};




