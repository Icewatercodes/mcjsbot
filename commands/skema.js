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
        try {
            var nowday = interaction.options.getInteger('dag') || undefined;
            var ephe = interaction.options.getBoolean('ephemeral');
        } catch (error) {
            var ephe = true;
            var nowday = undefined;
        }
        const sent = await interaction.reply({ content: 'Finder skema', withResponse: true, ephemeral: ephe});
        
        
        const skemajson = require("../skema.json");
        var skema = `Ugens skema ${skemajson.classes[0].day} til ${skemajson.classes[skemajson.classes.length-1].day}\n\n`;

            const days = [
                "mandag ",
                "tirsdag",
                "onsdag ",
                "torsdag",
                "fredag "
            ];

        if(nowday == undefined) {
            nowday = new Date().getDay();
            console.log(nowday);
            while(nowday == 5 || nowday == 6) {
                nowday++;
                if(nowday > 6) nowday = 0;
            }
            
        }

        console.log(nowday);
        const day = days[nowday];
        console.log(day);
        var correctClasses = [];
        for(const k in skemajson.classes) {
            //klass = skemajson.classes[k];
            //console.log(`k: ${k}`)
            //console.log(`${skemajson.classes[k].day.slice(0,7)} == ${day}`)
            if(skemajson.classes[k].day.slice(0,7) != day) continue;
            correctClasses.push(k);

            }

            skema +=
            `***Dag: ${skemajson.classes[correctClasses[0]].day}***\n`;
            for(const i in correctClasses){
                //console.log()
                if(skemajson.classes[correctClasses[i]].time != undefined){
                    skema += `    **Tid:** ${skemajson.classes[correctClasses[i]].time}\n`;
                    skema += `    **Fag:** ${skemajson.classes[correctClasses[i]].course.split(" - ")[2]}\n`;
                    skema += `    **Klasse:** ${skemajson.classes[correctClasses[i]].room}\n`
                    skema += `    **lektier:** ${skemajson.classes[correctClasses[i]].homework_notes}\n\n`
                }
            }




        }
        //send result
        await interaction.editReply({content: skema});
    },
};




