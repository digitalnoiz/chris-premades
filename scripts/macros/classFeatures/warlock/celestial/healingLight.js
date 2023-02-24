import {chris} from '../../../../helperFunctions.js';
export async function healingLight(workflow) {
    if (workflow.targets.size != 1) return;
    let healingLightFeatureUses = workflow.item.system.uses.value + 1;
    let healingLightMenuUses = Math.min(Math.max(1, workflow.actor.system.abilities.cha.mod), healingLightFeatureUses);
    console.log(healingLightMenuUses)
    let lightMenu = [];
    for (let i = healingLightMenuUses; i > 0; i--) {
        let diceString = i + 'd6';
        lightMenu.push([diceString, i]);
    }
    let selection = await chris.dialog('How many dice do you want to use?', lightMenu)
    await workflow.item.update({
        'system.uses.value': healingLightFeatureUses - selection
     });
     let diceRoll = await new Roll(selection + 'd6[healing]').roll({async: true});
     await workflow.setDamageRoll(diceRoll);
}