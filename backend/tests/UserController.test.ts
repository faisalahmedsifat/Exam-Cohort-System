// @ts-nocheck

const { uuid } = require("uuidv4");

// Models
const Models = require("../models");

// Controllers
const UserController = require("../controllers/UserController");

const dummyUsers = [
    {
        userID: uuid(),
        emailID: "faisalahmed531@gmail.com",
        firstName: "Faisal",
        lastName: "Ahmed",
    },
    {
        userID: uuid(),
        emailID: "faisalahmed111@gmail.com",
        firstName: "sal",
        lastName: "Aed",
    },
    {
        userID: uuid(),
        emailID: "arian@gmail.com",
        firstName: "arian",
        lastName: "",
    },
];

beforeAll(async () => {
    await Models.User.bulkCreate(dummyUsers);
});

describe("User details", () => {
    test('get user name from userID "UserController.getUserFromUserID(userID)" ', async () => {
        for(let dummyDataLength = 0; dummyDataLength < dummyUsers.length; dummyDataLength++){
            const user = await UserController.getUserFromUserID(dummyUsers[dummyDataLength].userID);
            expect(user.firstName).toBe(dummyUsers[dummyDataLength].firstName);
            expect(user.lastName).toBe(dummyUsers[dummyDataLength].lastName);
        }
    });

    test('check if user exists "UserController.checkIfUserExists(dummyUsers[0].emailID)"', async () => {
        for (
            let dummyDataLength = 0;
            dummyDataLength < dummyUsers.length;
            dummyDataLength++
        ) {
            const userExists = await UserController.checkIfUserExists(
                dummyUsers[dummyDataLength].emailID
            );
            expect(userExists).toBe(true);
        }
    });

    test('check if unknown user exists "UserController.checkIfUserExists(unknownEmailID)"', async () => {
        const userExists = await UserController.checkIfUserExists(
            "unknownEmailID@gmail.com"
        );
        expect(userExists).toBe(false);
    });

    test('get user profile details from userID "UserController.getUserProfileDetails(userID)" ', async () => {
        for (
            let dummyDataLength = 0;
            dummyDataLength < dummyUsers.length;
            dummyDataLength++
        ) {
            const userProfileDetails = await UserController.getUserProfileDetails(
                dummyUsers[dummyDataLength].userID
            );
            expect(userProfileDetails.firstName).toBe(
                dummyUsers[dummyDataLength].firstName
            );
            expect(userProfileDetails.lastName).toBe(
                dummyUsers[dummyDataLength].lastName
            );
            expect(userProfileDetails.emailID).toBe(
                dummyUsers[dummyDataLength].emailID
            );
            expect(userProfileDetails.NoOfExamCohorts).toBe(0);
        }
    });
    test('get user & cohorts "UserController.getUserAndCohortsFromUserID(userID)"', async () => {
        for (
            let dummyDataLength = 0;
            dummyDataLength < dummyUsers.length;
            dummyDataLength++
        ) {
            const userAndCohorts = await UserController.getUserAndCohortsFromUserID(
                dummyUsers[dummyDataLength].userID
            );
            expect(userAndCohorts.firstName).toBe(
                dummyUsers[dummyDataLength].firstName
            );
            expect(userAndCohorts.lastName).toBe(
                dummyUsers[dummyDataLength].lastName
            );
            expect(userAndCohorts.emailID).toBe(dummyUsers[dummyDataLength].emailID);
        }
    });
});

afterAll(async () => {
    for (
        let dummyDataLength = 0;
        dummyDataLength < dummyUsers.length;
        dummyDataLength++
    ) {
        await Models.User.destroy({
            where: {
                emailID: dummyUsers[dummyDataLength].emailID,
            },
        });
    }
});
