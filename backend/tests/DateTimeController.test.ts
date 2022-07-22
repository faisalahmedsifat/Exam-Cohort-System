// @ts-nocheck


// Models

// Controllers
const DateTimeController = require('../controllers/DateTimeController')

const validDates = [
    {
        availableDateTime : new Date('2023-01-01T00:00:00.000Z'),
        dueDateTime : new Date('2023-01-02T00:00:00.000Z'),
    },
    {
        availableDateTime : new Date('2022-12-12T00:00:00.000Z'),
        dueDateTime : new Date('2023-02-02T00:00:00.000Z'),
    },
    {
        availableDateTime : new Date('2023-04-01T00:00:00.000Z'),
        dueDateTime : new Date('2023-08-02T00:00:00.000Z'),
    },
];

const invalidDates = [
    {
        availableDateTime : new Date('2021-01-01T00:00:00.000Z'),
        dueDateTime : new Date('2022-01-01T00:00:00.000Z'),
    },
    {
        availableDateTime : new Date('2021-01-01T00:00:00.000Z'),
        dueDateTime : new Date('2020-01-01T00:00:00.000Z'),
    },
    {
        availableDateTime : new Date('2023-01-01T00:00:00.000Z'),
        dueDateTime : new Date('2023-01-01T00:00:00.000Z'),
    },
]

describe("Date Time Validation", () => {
    test("should return true for valid dates", () => {
        validDates.forEach(date => {
            expect(DateTimeController.isDateTimeValid(date.availableDateTime, date.dueDateTime)).toBe(true);
        });
    })

    test("should return false for invalid dates", () => {
        invalidDates.forEach(date => {
            expect(DateTimeController.isDateTimeValid(date.availableDateTime, date.dueDateTime)).toBe(false);
        });
    })
    
});
