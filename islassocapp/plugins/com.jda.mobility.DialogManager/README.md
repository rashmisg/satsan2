# Dialog Manager Plugin

### Overview

The dialog manager is a Cordova plugin which is integrated into Mobility projects by default. It can be used to display dialog boxes to the user. These can include prompts, confirmations, and requests for inputs.

### Syntax

The dialog manager is accessible via ```Jda.mobility.plugins.DialogManager```. There are 3 methods available on DialogManager, each of which takes a config object.

This example displays a simple alert box. An alert box has a title and a message, and a single button to close the alert. Each of these strings can be configured using the alert config object.

```
Jda.mobility.plugins.DialogManager.alert({
  message: 'The redcoats are coming!', // Required
  title: 'Paul Revere', // Optional
  buttonText: 'OK', // Optional
  callback: function() { ... } // Optional
});
```

A confirm dialog displays a dialog with a title, a message, and buttons. The ```buttonLabels``` option is used to create a button for each string in the array. If desired, this configuration point can be dropped in favor of the singular string ```okButtonText```. Because a MobileTools app will be deployed on different operating systems and devices, the positioning of these buttons in the dialog is not up to the developer to decide. It will use whatever existing standard there is for each device.

```
Jda.mobility.plugins.DialogManager.confirm({
  message: 'Are you sure you want to send money to store?', // Required
  title: 'Confirm Purchase', // Optional
  okButtonText: 'Send Money', // Optional. Overridden by buttonLabels
  buttonLabels: ['Many', 'Options', 'Go', 'Here'], // Optional
  cancelButtonText: 'Cancel Purchase', // Optional
  callback: function() { ... } // Optional
});
```

The final type of dialog, the prompt dialog, displays an input field to the user. Unlike the confirm dialog, this prompt can only have 2 buttons, one 'ok button' and one 'cancel button'. This input field has a customizable default value, along with all the other options of alert and confirm dialogs.

```
Jda.mobility.plugins.DialogManager.confirm({
  message: 'How much money would you like to pay towards credit card bill?', // Required
  title: 'Confirm Payment', // Optional
  okButtonText: 'Confirm', // Optional
  cancelButtonText: 'Cancel', // Optional
  defaultValue: '$100.00' // Optional
  callback: function() { ... } // Optional
```

### Callback Functions

Each dialog has the option to pass a callback function. The callback function will only be called if the dialog has completed successfully. This is defined to mean that the user has not clicked the cancel button. If the user clicks the 'cancel button', the callback function will not be called. For this reason, the callback functions' execution means success.

For the confirm dialog, the callback function will be given the string button label of the button that was pressed. For the prompt dialog, the callback function will be given the value of the input field as an argument.

```
Jda.mobility.plugins.DialogManager.prompt({
  message: 'Please select your favorite color',
  buttonLabels: ['Red', 'Blue', 'Yellow', 'Green'],
  callback: function(colorName) {
    console.log('The users favorite color is ' + colorName);
  }
});
Jda.mobility.plugins.DialogManager.confirm({
  message: 'How are you feeling today?',
  callback: function(mood) {
    console.log('The user is feeling ' + mood);
  }
```
