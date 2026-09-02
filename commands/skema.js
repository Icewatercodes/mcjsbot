const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skema')
        .setDescription('Print vore skema'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Finder skema', withResponse: true, ephemeral: true});

        const week = getWeek(new Date());
        //console.log(`uge: ${week}`)
        const skemajson = require(`../uge_${week}.json`);
        
        var skema = `Ugens skema ${skemajson.classes[0].day} til ${skemajson.classes[skemajson.classes.length-1].day}\n\n`;

        const days = [
            "mandag ",
            "tirsdag",
            "onsdag ",
            "torsdag",
            "fredag "
        ];

        var nowday = 0;
        if(nowday == undefined) {
            nowday = new Date().getDay()-1;
            
            //console.log(nowday);
            while(nowday == 5 || nowday == 6) {
                nowday++;
            }
        }

        //console.log(nowday);
        const day = days[nowday];
        //console.log(day);
        var correctClasses = [];
        for(const k in skemajson.classes) {
            //klass = skemajson.classes[k];
            //console.log(`k: ${k}`)
            //console.log(`${skemajson.classes[k].day.slice(0,7)} == ${day}`)
            if(skemajson.classes[k].day.slice(0,7) != day) continue;
            correctClasses.push(k);

        }

        //console.log(`correctClasses[0] = ${correctClasses[0]}`)

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

        

        await interaction.editReply({content: skema});
        
    },
};

function getWeek(d) {
    
    const dt = new Date(d); // Convert input string to Date object
    const ys = new Date(dt.getFullYear(), 0, 1); // Get January 1st of the same year
    const dp = Math.floor((dt - ys) / 86400000); // Calculate the days passed since January 1st (1000 * 60 * 60 * 24 = 86400000)
    const sw = ys.getDay();
    const so = (sw === 0) ? 6 : sw - 1;  // Adjust Sunday (0) to 6 (ISO starts Monday)
    const wn = Math.floor((dp + so) / 7) + 1;

    return wn;
}


