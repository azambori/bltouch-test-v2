function ShowNormal () {
    serial.writeLine("")
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        # # # # #
        `)
}
function ShowError () {
    serial.writeString(" ERROR_")
    serial.writeNumber(Count_Error)
    basic.showIcon(IconNames.No)
    basic.pause(5000)
}
input.onButtonPressed(Button.A, function () {
    StatusRUNSTOP = 0
    if (StatusSWMODEONOFF == 0) {
        StatusSWMODEONOFF = 1
        basic.showString("SW mode")
    } else {
        StatusSWMODEONOFF = 0
        basic.showString("HW mode")
    }
    basic.pause(5000)
})
function Deploy () {
    pins.servoWritePin(AnalogPin.P0, BlTouchDeploy)
    basic.showArrow(ArrowNames.East)
    basic.pause(BlTouchDELAY)
}
function ShowOk () {
    serial.writeString(" OK")
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
}
input.onButtonPressed(Button.AB, function () {
    StatusRUNSTOP = 0
    pins.servoWritePin(AnalogPin.P0, BlTouchReset)
    basic.showIcon(IconNames.SmallHeart)
    basic.showIcon(IconNames.Heart)
    basic.pause(2000)
    basic.clearScreen()
})
function SwmodeOn () {
    pins.servoWritePin(AnalogPin.P0, BltouchSWMODE)
    basic.pause(BlTouchDELAY)
}
input.onButtonPressed(Button.B, function () {
    if (StatusRUNSTOP == 1) {
        StatusRUNSTOP = 0
    } else {
        StatusRUNSTOP = 1
    }
})
function WriteLog (Log_Line: number, Log_Angle: number) {
    serial.writeString("#")
    serial.writeNumber(Log_Line)
    serial.writeString(" Servo angle: ")
    serial.writeNumber(Log_Angle)
}
let OUTPUT = 0
let ServoAngle = 0
let ERROR = 0
let Count = 0
let Count_Error = 0
let BltouchSWMODE = 0
let BlTouchDeploy = 0
let BlTouchReset = 0
let StatusRUNSTOP = 0
let BlTouchDELAY = 0
let StatusSWMODEONOFF = 0
let StatusDEPLOYSTOW = 0
StatusSWMODEONOFF = 1
BlTouchDELAY = 350
StatusRUNSTOP = 0
BlTouchReset = 160
BlTouchDeploy = 10
let BlTouchStow = 90
BltouchSWMODE = 60
let MaxAnlge = 300
let servocenterposition = 1450
let ServoDELAY = 500
pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
pins.servoSetPulse(AnalogPin.P2, servocenterposition)
basic.pause(ServoDELAY)
basic.pause(BlTouchDELAY)
pins.servoWritePin(AnalogPin.P0, BlTouchReset)
basic.pause(BlTouchDELAY)
pins.servoWritePin(AnalogPin.P0, BlTouchStow)
basic.pause(BlTouchDELAY)
serial.redirectToUSB()
basic.showLeds(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    # # . # #
    `)
Count_Error = 0
basic.forever(function () {
    if (StatusRUNSTOP == 1) {
        ShowNormal()
        Count += 1
        Deploy()
        if (pins.digitalReadPin(DigitalPin.P1) == 1) {
            Deploy()
            serial.writeLine("")
            serial.writeLine("Bl-Touch error, trying to recover")
            if (pins.digitalReadPin(DigitalPin.P1) == 1) {
                serial.writeLine("")
                serial.writeLine("ERROR can not recover Bl-Touch device")
                serial.writeLine("Please Hard Reset the device")
                serial.writeLine("Program STOPPED")
                basic.showIcon(IconNames.Sad)
                while (true) {
                	
                }
            }
        }
        if (StatusSWMODEONOFF == 1) {
            SwmodeOn()
        }
        ERROR = 1
        ServoAngle = 0
        while (ServoAngle <= MaxAnlge) {
            pins.servoSetPulse(AnalogPin.P2, servocenterposition - ServoAngle)
            basic.pause(1)
            OUTPUT = ServoAngle
            if (pins.digitalReadPin(DigitalPin.P1) == 1) {
                ERROR = 0
                break;
            }
            ServoAngle += 1
        }
        pins.servoSetPulse(AnalogPin.P2, servocenterposition)
        basic.pause(ServoDELAY)
        WriteLog(Count, OUTPUT)
        if (ERROR == 1) {
            Count_Error += 1
            ShowError()
        } else {
            ShowOk()
        }
    }
})
