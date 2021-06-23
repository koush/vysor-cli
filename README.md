# Vysor CLI

## Installation

```sh
npm -g install vysor
vysor -h
```

or 

```sh
npx vysor -h
```


## Usage

```
usage: vysor [options]

The following basic options are available:

-h or -?    Show this usage.

-l          Open the list of Vysor devices
-d          View all physical devices
-e          View all emulators
-s [serial] View device with the given [serial] number.

The following advanced options are available:

-i [id]     Some devices have multiple displays. The default behavior is
            to view the default display. This option overrides
            which display will be viewed. More information below:
            DisplayManager.getDisplays: https://bit.ly/3d07Ztl
            Display.getDisplayId: https://bit.ly/3j8cN3A

If no options are specified, Vysor will be launched as normal.
```
