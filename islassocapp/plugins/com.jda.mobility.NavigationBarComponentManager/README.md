# NavigationBarComponentManager

This plugin provides APIs for interacting with the navigation bar, such as adding + remove buttons.

## Example configs

### TimePeriodSelector 

    {
        type: 'TimePeriodSelector',
        location: Jda.mobility.plugins.NavigationBarComponentManager.locations.right,
        iconPath: 'calendar.png',
        title: 'Localized Title',
        applyButtonText: 'Localized Apply Button Text',
        selection: {
            group: 0,
            index: 2
        },
        groups: [{
            'title': 'Foo',
            'values': [
                'Foo 1',
                'Foo 2',
                'Foo 3'
            ]
        }, {
            'title': 'Bar',
            'values': [
                'Bar 1',
                'Bar 2'
            ]
        }]
    }
