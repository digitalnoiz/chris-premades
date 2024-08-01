import {actorUtils, animationUtils, compendiumUtils, constants, dialogUtils, errors, genericUtils, itemUtils, workflowUtils} from '../../utils.js';
async function use({trigger, workflow}) {
    if (!workflow.targets.size) return;
    let level = actorUtils.getLevelOrCR(workflow.actor);
    let boltsLeft = workflow.item.system.target.value + Math.floor((level + 1) * (1/6));
    let featureData = await compendiumUtils.getItemFromCompendium(constants.packs.spellFeatures, 'Eldritch Blast: Beam', {object: true});
    if (!featureData) {
        errors.missingPackItem();
        return;
    }
    featureData.system.damage.parts[0] = [
        itemUtils.getConfig(workflow.item, 'formula'),
        itemUtils.getConfig(workflow.item, 'damageType')
    ];
    let agonizingBlast = itemUtils.getItemByIdentifer(workflow.actor, 'agonizingBlast');
    if (agonizingBlast) featureData.system.damage.parts[0][0] += ' + @mod';
    featureData.system.ability = workflow.item.system.ability;
    let playAnimation = itemUtils.getConfig(workflow.item, 'playAnimation');
    let color = itemUtils.getConfig(workflow.item, 'color');
    let sound = itemUtils.getConfig(workflow.item, 'sound');
    genericUtils.setProperty(featureData, 'flags.chris-premades.eldritchBlast.sound', sound);
    while (boltsLeft) {
        let selection, skip;
        if (level >= 5) {
            [selection, skip] = await dialogUtils.selectTargetDialog(workflow.item.name, 'CHRISPREMADES.Macros.EldritchBlast.Target', Array.from(workflow.targets), {type: 'selectAmount', skipDeadAndUnconscious: true, coverToken: workflow.token, maxAmount: boltsLeft});
            if (!selection) return;
        } else {
            selection = [{document: workflow.targets.first(), value: 1}];
        }
        if (playAnimation) {
            if (color === 'random') color = eldritchBlast.config[Math.floor(Math.random() * 10)].value;
            genericUtils.setProperty(featureData, 'flags.chris-premades.eldritchBlast.color', color);
        }
        for (let i of selection) {
            for (let j = 0; j < i.value; j++) {
                let hp = i.document.actor?.system?.attributes?.hp?.value;
                if (!hp && skip) continue;
                await workflowUtils.syntheticItemDataRoll(featureData, workflow.actor, [i.document]);
                boltsLeft -= 1;
            }
        }
    }
}
async function beam({trigger, workflow}) {
    let color = workflow.item.flags['chris-premades']?.eldritchBlast?.color;
    if (!color) return;
    let sound = workflow.item.flags['chris-premades']?.eldritchBlast?.sound;
    let animation = 'jb2a.eldritch_blast.' + color;
    animationUtils.simpleAttack(workflow.token, workflow.targets.first(), animation, {sound: sound, missed: !workflow.hitTargets.has(workflow.targets.first())});
}
export let eldritchBlast = {
    name: 'Eldritch Blast',
    version: '0.12.0',
    midi: {
        item: [
            {
                pass: 'rollFinished',
                macro: use,
                priority: 50
            }
        ]
    },
    config: [
        {
            value: 'damageType',
            label: 'CHRISPREMADES.Config.DamageType',
            type: 'select',
            default: 'force',
            options: constants.damageTypeOptions,
            homebrew: true,
            category: 'homebrew'
        },
        {
            value: 'formula',
            label: 'CHRISPREMADES.Config.Formula',
            type: 'text',
            default: '1d10[force]',
            homebrew: true,
            category: 'homebrew'
        },
        {
            value: 'playAnimation',
            label: 'CHRISPREMADES.Config.PlayAnimation',
            type: 'checkbox',
            default: true,
            category: 'animation'
        },
        {
            value: 'color',
            label: 'CHRISPREMADES.Config.Color',
            type: 'select',
            default: 'purple',
            category: 'animation',
            options: [
                {
                    value: 'purple',
                    label: 'CHRISPREMADES.Config.Colors.Purple'
                },
                {
                    value: 'dark_green',
                    label: 'CHRISPREMADES.Config.Colors.DarkGreen',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'dark_pink',
                    label: 'CHRISPREMADES.Config.Colors.DarkPink',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'dark_purple',
                    label: 'CHRISPREMADES.Config.Colors.DarkPurple',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'dark_red',
                    label: 'CHRISPREMADES.Config.Colors.DarkRed',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'green',
                    label: 'CHRISPREMADES.Config.Colors.Green',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'lightblue',
                    label: 'CHRISPREMADES.Config.Colors.LightBlue',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'lightgreen',
                    label: 'CHRISPREMADES.Config.Colors.LightGreen',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'orange',
                    label: 'CHRISPREMADES.Config.Colors.Orange',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'pink',
                    label: 'CHRISPREMADES.Config.Colors.Pink',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'yellow',
                    label: 'CHRISPREMADES.Config.Colors.Yellow',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'rainbow',
                    label: 'CHRISPREMADES.Config.Colors.Rainbow',
                    requiredModules: ['jb2a_patreon']
                },
                {
                    value: 'random',
                    label: 'CHRISPREMADES.Config.Colors.Random',
                    requiredModules: ['jb2a_patreon']
                }
            ]
        },
        {
            value: 'sound',
            label: 'CHRISPREMADES.Config.Sound',
            type: 'file',
            default: '',
            category: 'sound'
        }
    ]
};
export let eldritchBlastBeam = {
    name: 'Eldritch Blast: Beam',
    version: eldritchBlast.version,
    midi: {
        item: [
            {
                pass: 'attackRollComplete',
                macro: beam,
                priority: 50
            }
        ]
    }
};