const NO_TAB_GROUP = chrome.tabGroups.TAB_GROUP_ID_NONE;
var lastActivatedTabGroup = NO_TAB_GROUP;
var lastActivatedTabGroupBefore = NO_TAB_GROUP;

Set.prototype.getByIndex = function(index) { return [...this][index]; }

// Returns all current tab groups in the correct order
async function getTabGroups() {
    // Get all unique group IDs
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const groupIds = new Set();
    for (const tab of tabs) {
        if (tab.groupId != NO_TAB_GROUP) {
            groupIds.add(tab.groupId);
        }
    }
    // Get all tabGroups
    const groups = new Set();
    for (const groupId of groupIds) {
        groups.add(await chrome.tabGroups.get(groupId))
    }
    return groups
}

async function newTabInCurrentTabGroup() {
    const currentTab = (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
    const newTab = await chrome.tabs.create({ index: currentTab.index + 1 });
    if (currentTab.groupId !== NO_TAB_GROUP) {
        await chrome.tabs.group({ tabIds: newTab.id, groupId: currentTab.groupId });
    }
}

async function ensureOnlyOneExpandedTabGroup(expandedGroupID) {
    if (lastActivatedTabGroup === NO_TAB_GROUP || 
        lastActivatedTabGroupBefore === NO_TAB_GROUP) {
        return;
    }
    // Collapse all other groups
    const groups = await getTabGroups();
    for (const group of groups) {
        chrome.tabGroups.update(group.id, { 
            collapsed: group.id !== expandedGroupID 
        });
    }
    // Activate first tab in group
    const tabs = await chrome.tabs.query({ currentWindow: true });
    for (const tab of tabs) {
        if (tab.groupId === expandedGroupID) {
            setTimeout(() => {
                chrome.tabs.update(tab.id, { active: true });
            }, 100);
            break;
        }
    }
}

async function toggleTabGroupCollapsed(command) {
    const targetGroup = Number(command.split('-').pop());
    const groups = await getTabGroups();
    if (groups.size >= targetGroup) {
        const targetGroupIdx = targetGroup - 1;
        const groupId = groups.getByIndex(targetGroupIdx).id;
        const newCollapsedState = !groups.getByIndex(targetGroupIdx).collapsed;
        chrome.tabGroups.update(groupId, { 
            collapsed: newCollapsedState 
        });
        if (newCollapsedState === true) {
            await ensureOnlyOneExpandedTabGroup(lastActivatedTabGroupBefore);
        } else {
            await ensureOnlyOneExpandedTabGroup(groupId);
        }
    }
}

// Appends [n] to every tab group title to make switching easier
async function numerateTabGroups() {
    const groups = await getTabGroups();
    for (let i = 0; i < groups.size; i++) {
        const group = groups.getByIndex(i);
        if (!group.title.endsWith(']')) {
            await chrome.tabGroups.update(group.id, {
                title: `${group.title} [${i + 1}]`
            });
        } else {
            await chrome.tabGroups.update(group.id, {
                title: group.title.replace(new RegExp('\[[0-9]+\]'), `[${i + 1}]`)
            });
        }
    }
}

chrome.commands.onCommand.addListener(async (command) => {
    switch (command) {
        case 'new-tab-in-current-group':
            newTabInCurrentTabGroup();
            break;
        case 'toggle-group-1':
        case 'toggle-group-2':
        case 'toggle-group-3':
        case 'toggle-group-4':
        case 'toggle-group-5':
        case 'toggle-group-6':
        case 'toggle-group-7':
        case 'toggle-group-8':
        case 'toggle-group-9':
            toggleTabGroupCollapsed(command);
            break;
        default:
            console.log(`Command ${command} not found`);
    }
})

chrome.tabs.onActivated.addListener(async (info) => {
    const tabInfo = await chrome.tabs.get(info.tabId);
    if (tabInfo.groupId === lastActivatedTabGroup) {
        return;
    } else if (tabInfo.groupId !== NO_TAB_GROUP) {
        setTimeout(
            async () => { 
                await ensureOnlyOneExpandedTabGroup(tabInfo.groupId) 
            }, 100
        )
    } else if (lastActivatedTabGroupBefore !== NO_TAB_GROUP) {
        setTimeout(
            async () => {
                const groups = await getTabGroups();
                for (const group of groups) {
                    await chrome.tabGroups.update(group.id, { collapsed: true });
                }
            }, 100
        )
    }
    lastActivatedTabGroupBefore = lastActivatedTabGroup;
    lastActivatedTabGroup = tabInfo.groupId;
});

