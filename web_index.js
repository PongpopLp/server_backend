const { ApolloServer } = require('apollo-server');
const mssql = require('mssql');

// const config = {
//   user: 'sa',
//   password: 'muIoT@101s',
//   server: '0.tcp.ap.ngrok.io',
//   port: 15834,
//   database: 'dDOTv2',
//   options: {
//     encrypt: false,
//     rejectUnauthorized: false,
//   },
// };
// const config = {
//   user: 'admin',
//   password: '123456Test',
//   server: 'mssql-170226-0.cloudclusters.net',
//   port: 10066,
//   database: 'dDOTv3',
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// };
const config = {
  user: 'sa',
  password: 'ThitinanD-D0T',
  server: '10.34.112.53',
  port: 1433,
  database: 'dDOTv3',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const typeDefs = `
  scalar Date

  type BooleanStatusOutput {
    Status: Boolean
  }

  input LoginInput {
    username: String!
    passwordHased: String!
  }

  input SideEffectInput {
    patientCID: String!
    effectDate: String
    effectTime: String
    effectDesc: String
  }

  input ColorBlindInput {
    patientCID: String!
    colorBlindDate: String
    colorBlindTime: String
    correct: Int
    incorrect: Int
    nothing: Int
    unsureCorrect: Int
    unsureIncorrect: Int
  }

  input UserAccountInput {
    username: String!
    password: String!
    createdBy: String!
    CID: String!
    Firstname: String!
    Lastname: String!
    Gender: String!
    dob: String!
    telephone: String!
    tambon: String!
    amphoe: String!
    province: String!
    homeAddress: String!
    email: String!
    userRole: String!
  }
  
  input PatientAccountInput {
    username: String
    password: String
    createdBy: String!
    CID: String!
    Firstname: String!
    Lastname: String!
    Gender: String!
    dob: String!
    telephone: String!
    tambon: String!
    amphoe: String!
    province: String!
    homeAddress: String!
    email: String!
    userRole: String!
  }

  input UsernameCheckInput {
    username: String!
  }

  input deleteUserInput {
    CID: String!
    userRole: String!
  }

  input AdmissionInput {
    patientCID: String!
  }

  type AdmissionType {
    admissionID: String
    startDate: String
    endDate: String
    patientCID: String
    localHospitalNumber: String
    fromLocalHospital: String
    fromAdmission: String
  }

  input dotInput {
    patientCID: String!
  }

  type dotType {
    dotID: String
    dotResult: String
    dotDate: String
    dotTime: String
    patientCID: String
  }

  type dayActivityType {
    date_: String
    pills_no: String
    isComplete: String
    cid: String
  }

  type dotActivityType {
    ActivityID: String
    date_: String
    time_: String
    videoLink: String
    pillEaten: String
    cid: String
  }

  type combineDayAndDotType {
    date_: String
    pills_no: String
    isComplete: String
    cid: String
    pillEaten: String
  }

  input combineDayAndDotInput {
    pillEaten: String
  }

  input dotActivityInput {
    pillEaten: String
  }

  input dayActivityStatusInput {
    isComplete: String
  }

  type userInfo2 {
    CID: String
    Firstname: String
    Lastname: String
    Gender: String
    dob: Date
    telephone: String
    tambon: String
    amphoe: String
    province: String
    homeAddress: String
    email: String
    userRole: String
    createdBy: String
    localHospitalNumber: String
  }

  type Query {
    Patient(registeredBy: String): [Patient],
    Pillbox: [Pillbox],
    Userinfo(Firstname: String, Lastname: String, CID: String, ObserverCID: String, Filter: String): [Userinfo],
    UserAccountWithUserInfo(CID: String, username: String, createdBy: String, Firstname: String, Lastname: String, tambon: String, telephone: String, amphoe: String, province: String, userRole: String): [UserAccountWithUserInfo],
    LocalHospital(localHospitalNumber: String): [LocalHospital]
    login(input: LoginInput): UserLogin
    UsernameCheck(input: UsernameCheckInput): UsernameCheck
    activitiesByPatientCID(patientCID: String!): [SlotActivity]
    getColorBlind(patientCID: String!): [ColorBlind]
    getSideEffect(patientCID: String!): [SideEffect]
    isValidPillbox(boxID: String!): Boolean
    getPatientAllInfo(CID: String!): [getPatientinfo]
    getVideoByActivityId(activityID: String!): [SlotActivity]
    getAdmission(input: AdmissionInput): AdmissionType
    getAllDotResults: [dotType]
    getDotResult(input: dotInput): [dotType]
    getDayActivity(patientCID: String!): [dayActivityType]
    getDotActivity(date_: String, cid: String, ActivityID: String): [dotActivityType]
    tryToGetHospital: [userInfo2]
  }

  type Unpair {
    unpairID: String
    patientCID: String
    boxID: String
    activityDate: String
    unpairDetail: String
  }

  type Patient {
    patientCID: String
    tbNumber: String
    daysTakenPill: String
    lastVisitedDate: String
    registeredBy: String
    boxID: String
  }

  type SlotActivity {
    activityID: Int
    patientCID: String
    boxID: String
    activityDate: String
    activityTime: String
    purpose: String
    youtubeLink: String
    isDotCompleted: Boolean
    isChecked: Boolean
  }

  type Observer {
    ObserverCID: String!
    localHospitalNumber: String
    isManager: Boolean
    canAddPatient: Boolean
  }

  type UsernameCheck {
    username: String
    createDate: String
    createdBy: String
  }

  type UserLogin {
    userAccount: UserAccount
    userInfo: Userinfo
  }

  type Pillbox {
    boxID: String
    localHospitalNumber: String
    startDate: String
    lastUpdate: String
    currentLocation: String
    simNumber: String
    pillboxStatus: String
  }

  type LocalHospital {
    localHospitalNumber: String
    localHospitalname: String
    tambon: String
    amphoe: String
    province: String
  }

  type UserAccount {
    username: String
    passwordHased: String
    createdBy: String
    CID: String
  }

  type UserAccountWithUserInfo {
    username: String!
    passwordHased: String
    createdBy: String!
    CID: String!
    Userinfo: Userinfo
    getCID: String!
  }
    
  type getPatientinfo {
    Firstname: String
    CID: String
    Lastname: String
    Gender: String
    dob: String
    telephone: String
    tambon: String
    amphoe: String
    province: String
    homeAddress: String
    email: String
    userRole: String
    createdBy: String
    colorBlinds: [ColorBlind]
    sideEffects: [SideEffect]
  }
  
  type ColorBlind {
    colorBlindID: Int!
    patientCID: String!
    colorBlindDate: String
    colorBlindTime: String
    correct: Int
    incorrect: Int
  }
  
  type SideEffect {
    sideEffectID: String
    patientCID: String
    effectDate: String
    effectTime: String
    effectDesc: String
  }

  input EditUserInput {
    CID: String
    Firstname: String
    Lastname: String
    Gender: String
    dob: Date
    telephone: String
    tambon: String
    amphoe: String
    province: String
    homeAddress: String
    email: String
    userRole: String
  }

  type Userinfo {
    CID: String
    Firstname: String
    Lastname: String
    Gender: String
    dob: Date
    telephone: String
    tambon: String
    amphoe: String
    province: String
    homeAddress: String
    email: String
    userRole: String
    createdBy: String 
  }

  type createUserType {
    username: String!
    password: String
    createdBy: String!
    CID: String!
    Firstname: String!
    Lastname: String!
    Gender: String!
    dob: String!
    telephone: String!
    tambon: String!
    amphoe: String!
    province: String!
    homeAddress: String!
    email: String!
    userRole: String!
  }

  input LoginInputUser {
    username: String!
    password: String!
  }

  input EditVideoStatus {
    isChecked: Boolean!
  }

  type AdmissionType {
    admissionID: String
    startDate: String
    endDate: String
    patientCID: String
    localHospitalNumber: String
  }

  type Mutation {
    addPillbox(
      boxID: String!
      localHospitalNumber: String
      startDate: String
      lastUpdate: String
      currentLocation: String
      simNumber: String
      pillboxStatus: String
    ): Pillbox,
    addSideEffect(
      patientCID: String!
      effectDate: Date
      effectDesc: String!
    ): SideEffect,
    createUser(userInfo: UserAccountInput!, localHospitalNumber: String!): createUserType,
    addObserver(
      observerCID: String!
      localHospitalNumber: String
      isManager: Boolean
      canAddPatient: Boolean
    ): Observer,
    createPatient(
      userInfo: PatientAccountInput!, 
      ObserverCID: String!, 
      localHospitalNumber: String!,
      startDate: Date!,
    ): Userinfo,
    deleteUser(
      deleteUserInput: deleteUserInput!
    ): BooleanStatusOutput,
    addSlotActivity(
      patientCID: String!
      boxID: String!
      activityDate: String!
      activityTime: String!
      purpose: String
      youtubeLink: String
    ): SlotActivity,
    pairPatientWithBox(
      patientCID: String!
      boxID: String!
    ): Patient,
    deleteSlotActivity(activityID: Int!): Boolean,
    createColorBlind(colorBlind: ColorBlindInput!): ColorBlind!,
    deleteColorBlind(colorBlindID: Int!): Boolean!,
    createSideEffect(sideEffect: SideEffectInput!): SideEffect!
    deleteSideEffect(sideEffectID: String!): Boolean!,
    deletePillbox(boxID: String!): Boolean,
    unpairBox(
      patientCID: String!
      boxID: String!
      unpairDetail: String!
    ): Unpair,
    updateUser(CID: String!, edits: EditUserInput!): Userinfo,
    loginUser(input: LoginInput): Userinfo,
    updateVideoStatus(activityID: Int!, edit: EditVideoStatus!): SlotActivity
    updatePillEaten(ActivityID: String!, edit: dotActivityInput!): dotActivityType
    updateStatusFotFistTime(date_: String!, cid: String!, edit: dayActivityStatusInput): dayActivityType
    updateIsCompleteForDay(date: String!, cid: String!, ActivityID: String): combineDayAndDotType
  }
`;

const resolvers = {
  Query: {
    async Patient(_, { registeredBy }) {
      var whereFilter = ""
      console.log(registeredBy)
      if (registeredBy) {
        whereFilter += "WHERE registeredBy = @registeredBy"
      }
      try {
        const pool = await mssql.connect(config);
        const result = await pool.request()
          .input('registeredBy', mssql.Char(13), registeredBy)
          .query('SELECT * FROM Patient ' + whereFilter);
        console.log("Patient" + result);
        return result.recordset;
      } catch (err) {
        console.error(err);
      }
    },
    async Pillbox() {
      try {
        const pool = await mssql.connect(config);
        const result = await pool.request()
          .query('SELECT * FROM Pillbox');
        console.log("Pillbox result" + result);
        return result.recordset;
      } catch (err) {
        console.error(err);
      }
    },
    isValidPillbox: async (_, { boxID }) => {
      console.log(boxID);
      try {
        const pool = await mssql.connect(config);
        const result = await pool.request()
          .input('boxID', mssql.VarChar(10), boxID) // Use 'boxID' instead of 'patientCID'
          .query('SELECT * FROM Pillbox WHERE boxID = @boxID'); // Change the table name and condition

        const pillboxExists = result.recordset.length > 0; // Check if any record is returned

        console.log(pillboxExists);
        return pillboxExists;
      } catch (err) {
        console.error(err);
      }
    },
    getSideEffect: async (_, { patientCID }) => {
      const pool = await mssql.connect(config);
      const result = await pool.request()
        .input('patientCID', mssql.Char(13), patientCID)
        .query(`SELECT * FROM SideEffect WHERE patientCID = @patientCID`);

      return result.recordset;
    },
    getColorBlind: async (_, { patientCID }) => {
      console.log(patientCID)
      const pool = await mssql.connect(config);
      const result = await pool.request()
        .input('patientCID', mssql.Char(13), patientCID)
        .query(`SELECT * FROM ColorBlind WHERE patientCID = @patientCID`);

      return result.recordset;
    },
    // activitiesByPatientCID: async (_, { patientCID }) => {
    //   console.log(patientCID)
    //   try {
    //     const pool = await mssql.connect(config);
    //     const result = await pool.request()
    //       .input('patientCID', mssql.Char(13), patientCID)
    //       .query('SELECT * FROM SlotActivity WHERE patientCID = @patientCID');

    //     console.log(result.recordset[0])
    //     return result.recordset;
    //   } catch (err) {
    //     console.error(err);
    //   }
    // },
    getVideoByActivityId: async (_, { activityID }) => {
      try {
        const pool = await mssql.connect(config)
        const result = await pool.request()
          .input('activityID', mssql.Char(), activityID)
          .query('SELECT * FROM SlotActivity WHERE activityID = @activityID')
        return result.recordset

      } catch (error) {
        console.log(`Failed to get activity: ${error}`)
      }
    },
    async LocalHospital(_, args) {
      try {
        const pool = await mssql.connect(config);
        let result;
        if (Object.keys(args).length !== 0) {
          console.log(args)
          result = await pool.request()
            .query(`SELECT * FROM LocalHospital WHERE localHospitalNumber = '${args.localHospitalNumber}'`);
        } else {
          result = await pool.request()
            .query('SELECT * FROM LocalHospital');
        }
        console.log("LocalHospital" + result);
        return result.recordset;
      } catch (err) {
        console.error(err);
      }
    },
    async UsernameCheck(_, args) {
      console.log(args)
      try {
        const pool = await mssql.connect(config);
        let query = 'SELECT * FROM UserAccount';
        query += ` WHERE username = '${args.input.username}'`;

        console.log(query);
        const result = await pool.request().query(query);
        if (!result) {
          console.log("No data found for the given criteria");
          return [];
        }
        console.log(result.recordset);
        return result.recordset[0];
      } catch (err) {
        console.error(err);
      }
    },
    async Userinfo(_, args) {
      // console.log(_);
      console.log(args);
      try {
        const pool = await mssql.connect(config);
        let query = 'SELECT DISTINCT Userinfo.* FROM Userinfo';
        if (args.ObserverCID) {
          console.log(args.ObserverCID);
          query += ` INNER JOIN Patient ON Userinfo.CID = Patient.patientCID
          INNER JOIN Observer ON Patient.registeredBy = ${args.ObserverCID}`;
          const result = await pool.request().query(query);
          console.log(result.recordset);
          return result.recordset;
        }

        if (args.Firstname || args.Lastname || args.CID) {
          query += ' WHERE ';
          if (args.Firstname) {
            query += `Firstname = '${args.Firstname}'`;
            if (args.Lastname || args.CID) {
              query += ' AND ';
            }
          }
          if (args.Lastname) {
            query += `Lastname = '${args.Lastname}'`;
            if (args.CID) {
              query += ' AND ';
            }
          }
          if (args.CID) {
            query += `CID = '${args.CID}'`;
          }
        }
        if (args.Filter) {
          console.log("Filter : " + args.Filter);
          query += ` WHERE Userinfo.userRole = '${args.Filter}'`;
        }

        const result = await pool.request().query(query);
        console.log(result.recordset);
        return result.recordset;
      } catch (err) {
        console.error(err);
      }
    },
    async UserAccountWithUserInfo(_, args) {
      var jsonData;
      const { CID, username, createdBy, Firstname, Lastname, tambon, telephone, amphoe, province, userRole } = args;
      console.log(args);
      try {
        let query = `
    SELECT DISTINCT UserAccount.*, Userinfo.*
    FROM UserAccount
    JOIN Userinfo ON UserAccount.CID = Userinfo.CID
    WHERE UserAccount.CID = @CID`;

        const pool = await mssql.connect(config);

        // Add optional named parameters to the SQL query and parameters object
        if (username) {
          query += ' AND UserAccount.username = @username';
        }
        if (createdBy) {
          query += ' AND UserAccount.createdBy = @createdBy';
        }
        if (Firstname) {
          query += ' AND Userinfo.Firstname = @Firstname';
        }
        if (Lastname) {
          query += ' AND Userinfo.Lastname = @Lastname';
        }
        if (tambon) {
          query += ' AND Userinfo.tambon = @tambon';
        }
        if (telephone) {
          query += ' AND Userinfo.telephone = @telephone';
        }
        if (amphoe) {
          query += ' AND Userinfo.amphoe = @amphoe';
        }
        if (province) {
          query += ' AND Userinfo.province = @province';
        }
        if (userRole) {
          query += ' AND Userinfo.userRole = @userRole';
        }

        // Add a LIMIT clause to limit the number of results

        // Define the input parameters object
        const inputParameters = {
          CID: mssql.VarChar(13),
        };

        // Add optional input parameters to the input parameters object
        if (username) {
          inputParameters.username = mssql.VarChar(20);
        }
        if (createdBy) {
          inputParameters.createdBy = mssql.VarChar(13);
        }
        if (Firstname) {
          inputParameters.Firstname = mssql.VarChar(50);
        }
        if (Lastname) {
          inputParameters.Lastname = mssql.VarChar(60);
        }
        if (tambon) {
          inputParameters.tambon = mssql.VarChar(30);
        }
        if (telephone) {
          inputParameters.telephone = mssql.VarChar(12);
        }
        if (amphoe) {
          inputParameters.amphoe = mssql.VarChar(30);
        }
        if (province) {
          inputParameters.province = mssql.VarChar(30);
        }
        if (userRole) {
          inputParameters.userRole = mssql.VarChar(10);
        }

        // Set the input parameter values
        inputParameters.CID = CID;
        if (username) {
          inputParameters.username = username;
        }
        if (createdBy) {
          inputParameters.createdBy = createdBy;
        }
        if (Firstname) {
          inputParameters.Firstname = Firstname;
        }
        if (Lastname) {
          inputParameters.Lastname = Lastname;
        }
        if (tambon) {
          inputParameters.tambon = tambon;
        }
        if (telephone) {
          inputParameters.telephone = telephone;
        }
        if (amphoe) {
          inputParameters.amphoe = amphoe;
        }
        if (province) {
          inputParameters.province = province;
        }
        if (userRole) {
          inputParameters.userRole = userRole;
        }


        const result = await pool.request().input('CID', inputParameters.CID)
          .input('username', inputParameters.username)
          .input('createdBy', inputParameters.createdBy)
          .input('Firstname', inputParameters.Firstname)
          .input('Lastname', inputParameters.Lastname)
          .input('tambon', inputParameters.tambon)
          .input('telephone', inputParameters.telephone)
          .input('amphoe', inputParameters.amphoe)
          .input('province', inputParameters.province)
          .input('userRole', inputParameters.userRole)
          .query(query);
        // console.log(result.recordset);
        // return result.recordset;
        jsonData = result.recordset[0]
        console.log(jsonData);
      } catch (err) {
        console.error(err);
      }

      if (!jsonData) {
        console.log("No data found for the given criteria");
        return [];
      }

      // Map the results to a new object with the desired fields
      const mergedData = {
        CID: jsonData.CID[0],
        username: jsonData.username,
        passwordHased: jsonData.passwordHased,
        createdBy: jsonData.createdBy,
        createDate: jsonData.createDate,
        Userinfo: {
          CID: jsonData.CID[0],
          Firstname: jsonData.Firstname,
          Lastname: jsonData.Lastname,
          Gender: jsonData.Gender,
          dob: jsonData.dob,
          telephone: jsonData.telephone,
          tambon: jsonData.tambon,
          amphoe: jsonData.amphoe,
          province: jsonData.province,
          homeAddress: jsonData.homeAddress,
          email: jsonData.email,
          userRole: jsonData.userRole
        }
      };

      console.log(mergedData);

      return [mergedData];
    },
    async login(_, { input }) {
      console.log(input);
      var jsonData;
      try {
        const pool = await mssql.connect(config);

        // Perform join query to get Userinfo and UserAccount data for the given username
        const result = await pool.request()
          .input('username', mssql.VarChar(50), input.username)
          .query(`
            SELECT ua.*, ui.*
            FROM UserAccount ua
            INNER JOIN Userinfo ui
            ON ua.CID = ui.CID
            WHERE ua.username = @username`);

        if (result.recordset.length === 0) {
          throw new Error('Invalid username or password');
        }

        const user = result.recordset[0];

        const isValidPassword = input.passwordHased === user.passwordHased;
        console.log(input.passwordHased, user.passwordHased, isValidPassword);
        if (!isValidPassword) {
          throw new Error('Invalid username or password');
        }

        // return result.recordset[0];
        console.log(result.recordset[0]);
        jsonData = user;
      } catch (error) {
        console.error(error);
        throw error;
      }

      const mergedData = {
        userInfo: {
          Firstname: jsonData.Firstname,
          Lastname: jsonData.Lastname,
          Gender: jsonData.Gender,
          dob: jsonData.dob,
          telephone: jsonData.telephone,
          tambon: jsonData.tambon,
          amphoe: jsonData.amphoe,
          province: jsonData.province,
          homeAddress: jsonData.homeAddress,
          email: jsonData.email,
          userRole: jsonData.userRole
        },
        userAccount: {
          username: jsonData.username,
          passwordHased: jsonData.passwordHased,
          createdBy: jsonData.createdBy,
          createDate: jsonData.createDate,
          CID: jsonData.CID[0],
        },
      };

      console.log(mergedData);
      return mergedData;

    },
    async getPatientAllInfo(_, args) {
      try {
        const pool = await mssql.connect(config);

        // Query Userinfo and Patient data
        let query = `
          SELECT
            Userinfo.*,
            Patient.patientCID
          FROM Userinfo
          INNER JOIN Patient ON Userinfo.CID = Patient.patientCID
        `;

        if (args.CID) {
          query += ` WHERE Userinfo.CID = '${args.CID}'`;
        }

        // console.log('Query ', query);

        const result = await pool.request().query(query);
        const patients = result.recordset;

        // Query ColorBlind data
        const colorBlindQuery = `
          SELECT
            ColorBlind.*
          FROM ColorBlind
          WHERE patientCID IN (${patients.map(patient => `'${patient.patientCID}'`).join(',')})
        `;

        const colorBlindResult = await pool.request().query(colorBlindQuery);
        const colorBlinds = colorBlindResult.recordset;

        // Query SideEffect data
        const sideEffectQuery = `
          SELECT
            SideEffect.*
          FROM SideEffect
          WHERE patientCID IN (${patients.map(patient => `'${patient.patientCID}'`).join(',')})
        `;

        const sideEffectResult = await pool.request().query(sideEffectQuery);
        const sideEffects = sideEffectResult.recordset;

        // Combine the data
        const processedData = patients.map(patient => {
          const patientColorBlinds = colorBlinds.filter(cb => cb.patientCID === patient.patientCID);
          const patientSideEffects = sideEffects.filter(se => se.patientCID === patient.patientCID);

          return {
            ...patient,
            colorBlinds: patientColorBlinds,
            sideEffects: patientSideEffects,
          };
        });

        return processedData;
      } catch (error) {
        console.log(`Failed to get patient data (ALL): ${error}`);
      }
    },
    async getAdmission(_, { input }) {
      let pool;
      console.log('input: ', input)
      try {
        pool = await mssql.connect(config);

        let query = `
          SELECT
            admissionID,
            startDate,
            endDate,
            patientCID,
            localHospitalNumber,
            fromLocalHospital,
            fromAdmission
          FROM Admission
          WHERE patientCID = @patientCID
        `;

        const result = await pool
          .request()
          .input('patientCID', mssql.VarChar(50), input.patientCID)
          .query(query);

        if (result.recordset.length === 0) {
          throw new Error('Admission not found');
        }

        // Return the admission data
        return result.recordset[0];
      } catch (error) {
        console.log(`Failed to get admission: ${error}`);
        throw error;
      } finally {
        if (pool) {
          try {
            await pool.close();
          } catch (e) {
            console.error(`Error closing pool: ${e}`);
          }
        }
      }
    },
    async getAllDotResults() {
      try {
        const pool = await mssql.connect(config)
        const result = await pool.request()
          .query('SELECT * FROM Dot')
        return result.recordset
      } catch (error) {
        console.log(`Failed to get dot results: ${error.message}`)
      }
    },
    async getDotResult(_, args) {
      try {
        const pool = await mssql.connect(config);
        const patientCID = args.input.patientCID
        const result = await pool.request()
          .input('patientCID', mssql.Char(13), patientCID)
          .query('SELECT * FROM Dot WHERE patientCID = @patientCID')

        return result.recordset
      } catch (error) {
        console.log(`Failed to get dot result: ${error.message}`);
        throw error;
      }
    },
    async getDayActivity(_, { patientCID }) {
      try {
        const pool = await mssql.connect(config)
        const result = await pool.request()
          .input('CID', mssql.Char(13), patientCID)
          .query('SELECT * FROM DayActivity WHERE cid = @cid')
        console.log('result: ', result)
        return result.recordset
      } catch (error) {
        console.log('Failed to get dayActivity: ', error)
      }
    },
    async getDotActivity(_, { date_, cid, ActivityID }) {
      try {
        // Validate input parameters
        if (!date_ && !cid && !ActivityID) {
          throw new Error('At least one of date_, cid, or ActivityID parameters is required.');
        }

        const pool = await mssql.connect(config);
        let query = 'SELECT * FROM dotActivity WHERE 1=1';

        if (date_) {
          query += ' AND [date_] = @date_';
        }

        if (cid) {
          query += ' AND cid = @cid';
        }

        if (ActivityID) {
          query += ' AND ActivityID = @ActivityID';
        }

        const request = pool.request();

        if (date_) {
          request.input('date_', mssql.VarChar, date_);
        }

        if (cid) {
          request.input('cid', mssql.VarChar, cid);
        }

        if (ActivityID) {
          request.input('ActivityID', mssql.VarChar, ActivityID);
        }

        const result = await request.query(query);

        console.log('Dot activity: ', result);
        return result.recordset;
      } catch (error) {
        console.log('Failed to get dot activity: ', error);
        throw new Error('Failed to get dot activity.');
      }
    },
    async tryToGetHospital() {
      try {
        // Connect to the database
        const pool = await mssql.connect(config);
        
        // Query to get userInfo with hospitalNumber from Admission table
        const result = await pool.request().query(`
          SELECT
            u.CID,
            u.Firstname,
            u.Lastname,
            u.Gender,
            u.dob,
            u.telephone,
            u.tambon,
            u.amphoe,
            u.province,
            u.homeAddress,
            u.email,
            u.userRole,
            a.localHospitalNumber
          FROM
            Userinfo u
          INNER JOIN
            Admission a ON u.CID = a.patientCID;
        `);
    
        // Close the database connection
        await pool.close();
    
        // Return the result
        return result.recordset;
      } catch (error) {
        console.log('Error while trying to get hospital information:', error.message);
        throw new Error('Failed to get hospital information.');
      }
    },
  },
  Mutation: {
    
    createUser: async (_, args) => {
      const { userInfo, localHospitalNumber } = args;
      const { username, password, createdBy, CID, Firstname, Lastname, Gender, dob, telephone, tambon, amphoe, province, homeAddress, email, userRole } = userInfo;

      console.log(username, password, createdBy, CID, Firstname, Lastname, Gender, dob, telephone, tambon, amphoe, province, homeAddress, email, userRole);

      // return {
      //   Firstname: Firstname,
      //   Lastname: Lastname,
      //   CID: CID
      // }
      try {
        const pool = await mssql.connect(config);

        // Insert user info into Userinfo table
        const result = await pool.query(`
          INSERT INTO Userinfo (
            CID, Firstname, Lastname, Gender, dob, telephone,
            tambon, amphoe, province, homeAddress, email, userRole
          )
          OUTPUT inserted.CID
          VALUES (
            '${CID}', '${Firstname}', '${Lastname}', '${Gender}', '${dob}', '${telephone}',
            '${tambon}', '${amphoe}', '${province}', '${homeAddress}', '${email}', '${userRole}'
          );
        `);

        const newUserId = result.recordset[0].CID;

        // Insert user account data into UserAccount table
        const insertAccountResult = await pool.query(`
          INSERT INTO UserAccount (
            username, passwordHased, createdBy, createDate, CID
          )
          VALUES (
            '${username}', '${password}', '${createdBy}', GETDATE(), '${newUserId}'
          );
        `);

        if (userRole == "OBSERVER" || userRole == "HOSPITAL") {
          console.log(userRole + " Add data to Observer table!")
          try {
            const result = await pool
              .request()
              .input('observerCID', mssql.VarChar(13), CID)
              .input('localHospitalNumber', mssql.VarChar(12), localHospitalNumber)
              .input('isManager', mssql.Bit, true)
              .input('canAddPatient', mssql.Bit, true)
              .query(`INSERT INTO Observer (observerCID, localHospitalNumber, isManager, canAddPatient)
                      VALUES (@observerCID, @localHospitalNumber, @isManager, @canAddPatient);
                      SELECT * FROM Observer WHERE observerCID = @observerCID`);
            const updatedObserver = await pool
              .request()
              .query('SELECT * FROM Observer');
            console.log('Updated Observer Table:', updatedObserver.recordset);
          } catch (err) {
            console.error(err);
          }
        }

        // If both queries were successful, return the newly created user object
        return {
          CID: newUserId,
          Firstname: Firstname,
          Lastname: Lastname,
          Gender: Gender,
          dob: dob,
          telephone: telephone,
          tambon: tambon,
          amphoe: amphoe,
          province: province,
          homeAddress: homeAddress,
          email: email,
          userRole: userRole,
          username: username,
          passwordHased: password,
          createdBy: createdBy
        };
      } catch (err) {
        console.error(err);
        return "Cannot create new account";
      } finally {
        mssql.close();
      }
    },
    createPatient: async (_, args) => {
      const { userInfo, ObserverCID, localHospitalNumber, startDate, endDate } = args
      const pool = await mssql.connect(config)
      try {
        const observerCheckResult = await pool.request()
          .input('observerCID', mssql.VarChar, ObserverCID)
          .query(`
            SELECT COUNT(*) AS count
            FROM Observer
            WHERE observerCID = @observerCID
          `)
        const observerExists = observerCheckResult.recordset[0].count > 0;

        if (!observerExists) {
          throw new Error('ObserverCID does not exist in the database.');
        }

        const result = await pool.request()
          .input('CID', mssql.VarChar, userInfo.CID)
          .input('Firstname', mssql.VarChar, userInfo.Firstname)
          .input('Lastname', mssql.VarChar, userInfo.Lastname)
          .input('Gender', mssql.VarChar, userInfo.Gender)
          .input('dob', mssql.Date, userInfo.dob)
          .input('telephone', mssql.VarChar, userInfo.telephone)
          .input('tambon', mssql.VarChar, userInfo.tambon)
          .input('amphoe', mssql.VarChar, userInfo.amphoe)
          .input('province', mssql.VarChar, userInfo.province)
          .input('homeAddress', mssql.VarChar, userInfo.homeAddress)
          .input('email', mssql.VarChar, userInfo.email)
          .input('userRole', mssql.VarChar, userInfo.userRole)
          .output('insertedCID', mssql.VarChar)
          .query(`
        INSERT INTO Userinfo (
          CID, Firstname, Lastname, Gender, dob, telephone,
          tambon, amphoe, province, homeAddress, email, userRole
        )
        OUTPUT inserted.CID
        VALUES (
          @CID, @Firstname, @Lastname, @Gender, @dob, @telephone,
          @tambon, @amphoe, @province, @homeAddress, @email, @userRole
        )
      `)

        console.log('result: ', result)

        const newUserId = result.recordset[0].CID;
        console.log('userNewId: ', newUserId)

        await pool.request()
          .input('patientCID', mssql.VarChar, userInfo.CID)
          .input('registeredBy', mssql.VarChar, ObserverCID || userInfo.createdBy)
          .query(`
        INSERT INTO Patient (patientCID, tbNumber, daysTakenPill, lastVisitedDate, registeredBy, boxID)
        VALUES (@patientCID, '', '', GETDATE(), @registeredBy, null);
      `);

        await pool.request()
          .input('patientCID', mssql.VarChar, userInfo.CID)
          .input('localHospitalNumber', mssql.VarChar, localHospitalNumber)
          .input('startDate', mssql.Date, startDate)
          .input('endDate', mssql.Date, null)
          .query(`
            INSERT INTO Admission (patientCID, localHospitalNumber, startDate, endDate)
            VALUES (@patientCID, @localHospitalNumber, @startDate, @endDate);
          `);

        await pool.close();

        return {
          CID: userInfo.CID,
          Firstname: userInfo.Firstname,
          Lastname: userInfo.Lastname,
          Gender: userInfo.Gender,
          dob: userInfo.dob,
          telephone: userInfo.telephone,
          tambon: userInfo.tambon,
          amphoe: userInfo.amphoe,
          province: userInfo.province,
          homeAddress: userInfo.homeAddress,
          email: userInfo.email,
          userRole: userInfo.userRole,
          username: userInfo.username,
          passwordHased: userInfo.password,
          createdBy: userInfo.createdBy
        };

      } catch (error) {
        console.log('Failed to create patient: ', error.message)
        throw new Error('Failed to create patient.');
      }
    },
    addPillbox: async (_, args) => {
      try {
        const pool = await mssql.connect(config);
        const request = pool.request();

        const {
          boxID,
          localHospitalNumber,
          startDate,
          lastUpdate,
          currentLocation,
          simNumber,
          pillboxStatus,
        } = args;

        const query = `
          INSERT INTO Pillbox (
            boxID,
            localHospitalNumber,
            startDate,
            lastUpdate,
            currentLocation,
            simNumber,
            pillboxStatus
          )
          VALUES (
            @boxID,
            @localHospitalNumber,
            @startDate,
            @lastUpdate,
            @currentLocation,
            @simNumber,
            @pillboxStatus
          );

          SELECT TOP 1 * FROM Pillbox WHERE boxID = @boxID;
        `;

        console.log(args);

        request.input('boxID', mssql.VarChar, boxID);
        request.input('localHospitalNumber', mssql.VarChar, localHospitalNumber);
        request.input('startDate', mssql.Date, startDate);
        request.input('lastUpdate', mssql.Date, lastUpdate);
        request.input('currentLocation', mssql.VarChar, currentLocation);
        request.input('simNumber', mssql.VarChar, simNumber);
        request.input('pillboxStatus', mssql.VarChar, pillboxStatus);

        const result = await request.query(query);
        return result.recordset[0];
      } catch (error) {
        console.error('Error adding pillbox:', error);
        throw new Error('Failed to add pillbox.');
      }
    },
    deletePillbox: async (_, args) => {
      console.log(args)
      try {
        const pool = await mssql.connect(config);
        const request = pool.request();

        const { boxID } = args;

        const query = `
          DELETE FROM Pillbox
          WHERE boxID = @boxID;
        `;

        request.input('boxID', mssql.VarChar, boxID);

        const result = await request.query(query);
        return true;
      } catch (error) {
        console.error('Error deleting pillbox:', error);
        throw new Error('Failed to delete pillbox.');
      }
    },
    deleteUser: async (_, args) => {
      const { deleteUserInput } = args;
      const { CID, userRole } = deleteUserInput;
      console.log('test delete: ', args);
      if (Object.keys(args).length !== 0) {
        if (userRole == "test") {
          return { Status: false }
        }
        try {
          const pool = await mssql.connect(config);
          if (userRole == "HOSPITAL" || userRole == "OBSERVER") {
            try {
              const result = await pool
                .request()
                .query(`
                  DELETE FROM Observer WHERE observerCID = '${CID}';
                  DELETE FROM UserAccount WHERE CID = '${CID}';
                  DELETE FROM Userinfo WHERE CID = '${CID}';
                  `)
              console.log(result.recordset === undefined);
            }
            catch (err) {
              console.error(err);
            }
            return { Status: true }
          }
          if (userRole == "PATIENT") {
            return { Status: true }
          }
        }
        catch (err) {
          console.error(err);
        }
      }
      return { Status: false }
    },
    addSlotActivity: async (_, args) => {
      try {
        // Insert the new SlotActivity into the database
        const pool = await mssql.connect(config);
        const result = await pool
          .request()
          .input('patientCID', mssql.Char(13), args.patientCID)
          .input('boxID', mssql.VarChar(10), args.boxID)
          .input('activityDate', mssql.Date, args.activityDate)
          .input('activityTime', mssql.Time, convertTimeToServerTimezone(args.activityTime))
          .input('purpose', mssql.VarChar(10), args.purpose)
          .input('youtubeLink', mssql.VarChar(60), args.youtubeLink)
          .input('isDotCompleted', mssql.Bit, false)
          .input('isChecked', mssql.Bit, false)
          .query(
            'INSERT INTO SlotActivity (patientCID, boxID, activityDate, activityTime, purpose, youtubeLink, isDotCompleted, isChecked) VALUES (@patientCID, @boxID, @activityDate, @activityTime, @purpose, @youtubeLink, @isDotCompleted, @isChecked); SELECT SCOPE_IDENTITY() AS activityID;'
          );

        // Retrieve the newly created SlotActivity from the database and return it
        const activityID = result.recordset[0].activityID;
        const newSlotActivity = {
          activityID,
          patientCID: args.patientCID,
          boxID: args.boxID,
          activityDate: args.activityDate,
          activityTime: args.activityTime.toLocaleTimeString,
          purpose: args.purpose,
          youtubeLink: args.youtubeLink,
          isDotCompleted: false,
          isChecked: false,
        };
        return newSlotActivity;
      } catch (err) {
        console.log(err);
        throw new Error('Failed to add new SlotActivity');
      }
    },
    deleteSlotActivity: async (_, { activityID }) => {
      try {
        // Delete the specified SlotActivity from the database
        const pool = await mssql.connect(config);
        const result = await pool
          .request()
          .input('activityID', mssql.Int, activityID)
          .query('DELETE FROM SlotActivity WHERE activityID = @activityID');

        // Check if the deletion was successful and return a boolean indicating the result
        const rowsAffected = result.rowsAffected[0];
        return rowsAffected > 0;
      } catch (err) {
        console.log(err);
        throw new Error('Failed to delete SlotActivity');
      }
    },
    createColorBlind: async (_, { colorBlind }) => {
      const { patientCID, colorBlindDate, colorBlindTime, correct, incorrect, nothing, unsureCorrect, unsureIncorrect } = colorBlind;

      console.log(colorBlind)
      try {
        const pool = await mssql.connect(config);
        const result = await pool
          .request()
          .input('patientCID', mssql.VarChar(13), patientCID)
          .input('colorBlindDate', mssql.Date, colorBlindDate)
          .input('colorBlindTime', mssql.Time, convertTimeToServerTimezone(colorBlindTime))
          .input('correct', mssql.Int, correct)
          .input('incorrect', mssql.Int, incorrect)
          .input('nothing', mssql.Int, nothing)
          .input('unsureCorrect', mssql.Int, unsureCorrect)
          .input('unsureIncorrect', mssql.Int, unsureIncorrect)
          .query(`
          INSERT INTO ColorBlind (patientCID, colorBlindDate, colorBlindTime, correct, incorrect, nothing, unsureCorrect, unsureIncorrect)
          VALUES (@patientCID, @colorBlindDate, @colorBlindTime, @correct, @incorrect, @nothing, @unsureCorrect, @unsureIncorrect);
          SELECT SCOPE_IDENTITY() AS colorBlindID;
        `);

        const colorBlindID = result.recordset[0].colorBlindID;

        return {
          colorBlindID,
          patientCID,
          colorBlindDate,
          colorBlindTime,
          correct,
          incorrect,
          nothing,
          unsureCorrect,
          unsureIncorrect,
        };
      }
      catch (error) {
        console.log(`Failed to add ColorBlind: ${error.message}`);
        throw new Error('Failed to add ColorBlind');
      }
    },
    deleteColorBlind: async (_, { colorBlindID }) => {
      const pool = await mssql.connect(config);
      const result = await pool.request()
        .input('colorBlindID', mssql.Int, colorBlindID)
        .query(`
          DELETE FROM ColorBlind
          WHERE colorBlindID = @colorBlindID;
        `);

      return true;
    },
    createSideEffect: async (_, { sideEffect }) => {
      console.log(sideEffect)
      const { patientCID, effectDate, effectTime, effectDesc } = sideEffect;

      const pool = await mssql.connect(config);
      const result = await pool.request()
        .input('patientCID', mssql.VarChar(13), patientCID)
        .input('effectDate', mssql.Date, effectDate)
        .input('effectTime', mssql.Time, convertTimeToServerTimezone(effectTime))
        .input('effectDesc', mssql.VarChar(100), effectDesc)
        .query(`
          INSERT INTO SideEffect (patientCID, effectDate, effectTime, effectDesc)
          VALUES (@patientCID, @effectDate, @effectTime, @effectDesc);
          SELECT SCOPE_IDENTITY() AS sideEffectID;
        `);

      const sideEffectID = result.recordset[0].sideEffectID;

      return {
        sideEffectID,
        patientCID,
        effectDate,
        effectTime,
        effectDesc,
      };
    },
    deleteSideEffect: async (_, { sideEffectID }) => {
      const pool = await mssql.connect(config);
      const result = await pool.request()
        .input('sideEffectID', mssql.Int, sideEffectID)
        .query(`
          DELETE FROM SideEffect
          WHERE sideEffectID = @sideEffectID;
        `);

      return true;
    },
    pairPatientWithBox: async (_, { boxID, patientCID }) => {
      console.log("Received request to pair patient with box. Box ID:", boxID, "Patient CID:", patientCID);
      try {
        // Connect to the MSSQL database
        const pool = await mssql.connect(config);
    
        // Check if the pillbox has already been assigned
        const pillboxResult = await pool.request().query(`
          SELECT *
          FROM Pillbox
          WHERE boxID = '${boxID}'
            AND pillboxStatus = 'ASSIGNED'
        `);
        if (pillboxResult.recordset.length > 0) {
          throw new Error('Pillbox is already assigned to another patient.');
        }
    
        // Check if the patient already has a pillbox assigned
        const patientResult = await pool.request().query(`
          SELECT *
          FROM Patient
          WHERE patientCID = '${patientCID}'
            AND boxID IS NOT NULL
        `);
        if (patientResult.recordset.length > 0) {
          throw new Error('Patient already has a pillbox assigned.');
        }
    
        // Prepare the SQL queries
        const updatePatientQuery = `
          UPDATE Patient
          SET boxID = @boxID
          WHERE patientCID = @patientCID
        `;
    
        const updatePillboxQuery = `
          UPDATE Pillbox
          SET lastUpdate = GETDATE(),
              pillboxStatus = 'ASSIGNED'
          WHERE boxID = @boxID
        `;
    
        // Create a new transaction
        const transaction = new mssql.Transaction(pool);
    
        // Begin the transaction
        await transaction.begin();
    
        try {
          // Create a new request for updating the patient
          const patientRequest = new mssql.Request(transaction);
          patientRequest.input('boxID', mssql.VarChar(10), boxID);
          patientRequest.input('patientCID', mssql.Char(13), patientCID);
          await patientRequest.query(updatePatientQuery);
    
          // Create a new request for updating the pillbox
          const pillboxRequest = new mssql.Request(transaction);
          pillboxRequest.input('boxID', mssql.VarChar(10), boxID);
          await pillboxRequest.query(updatePillboxQuery);
    
          // Commit the transaction
          await transaction.commit();

          console.log('transaction: ', transaction)
    
          // Close the MSSQL connection
          await pool.close();
    
          console.log("Patient and pillbox updated successfully");
    
          // Return the success message
          return "Patient and pillbox updated successfully";
        } catch (transactionError) {
          // Rollback the transaction in case of error
          await transaction.rollback();
    
          // Close the MSSQL connection
          await pool.close();
    
          // Handle the error
          console.error('Failed to update patient and pillbox', transactionError);
          throw new Error('Failed to update patient and pillbox. Please try again later.');
        }
      } catch (error) {
        // Handle the error
        console.error('Failed to update patient and pillbox', error);
        throw new Error('Failed to update patient and pillbox. Please try again later.');
      }
    },    
    unpairBox: async (_, { patientCID, boxID, unpairDetail }) => {
      console.log("Received request to unpair box. Patient CID:", patientCID, "Box ID:", boxID, "Unpair Detail:", unpairDetail);
      const youtubeLink = '15873675869561234567890123.mp4';
      try {
        // Connect to your MSSQL database.
        const pool = await mssql.connect(config);
        const request = pool.request();
    
        // Update Unpair table.
        await request.query(`
          INSERT INTO Unpair (patientCID, boxID, activityDate, unpairDetail)
          VALUES ('${patientCID}', '${boxID}', GETDATE(), '${unpairDetail}')
        `);
    
        // Update Patient table.
        await request.query(`
          UPDATE Patient SET boxID = NULL WHERE patientCID = '${patientCID}'
        `);
    
        // Update Pillbox table.
        await request.query(`
          UPDATE Pillbox
          SET pillboxStatus = 'EMPTY', currentLocation = '13.7653,100.4536', lastUpdate = GETDATE()
          WHERE boxID = '${boxID}'
        `);
    
        // Return the unpair object.
        const result = await request.query(`SELECT * FROM Unpair WHERE unpairID = SCOPE_IDENTITY()`);
        console.log("unpairBox", result.recordset[0]);
        return result.recordset[0];
      } catch (error) {
        // Handle any errors that occur during the execution.
        console.error('Error unpairing box:', error);
        throw new Error('An error occurred while unpairing the box.');
      }
    },    
    // pairPatientWithBox: async (_, { boxID, patientCID }) => {
    //   console.log({ boxID, patientCID });
    //   const youtubeLink = '15873675869561234567890123.mp4';
    //   try {
    //     // Connect to the MSSQL database
    //     const pool = await mssql.connect(config);

    //     await pool.query(`INSERT INTO SlotActivity (patientCID, boxID, activityDate, activityTime, purpose, youtubeLink, isDotCompleted, isChecked)
    //     VALUES ('${patientCID}', '${boxID}', GETDATE(), GETDATE(), 'PAIRED', '${youtubeLink}', 0, 0)`);

    //     // Prepare the SQL queries
    //     const updatePatientQuery = `
    //       UPDATE Patient
    //       SET boxID = @boxID
    //       WHERE patientCID = @patientCID
    //     `;

    //     const updatePillboxQuery = `
    //       UPDATE Pillbox
    //       SET lastUpdate = GETDATE(),
    //           pillboxStatus = 'ASSIGNED'
    //       WHERE boxID = @boxID
    //     `;

    //     // Create a new transaction
    //     const transaction = new mssql.Transaction(pool);

    //     // Begin the transaction
    //     await transaction.begin();

    //     try {
    //       // Create a new request for updating the patient
    //       const patientRequest = new mssql.Request(transaction);
    //       patientRequest.input('boxID', mssql.VarChar(10), boxID);
    //       patientRequest.input('patientCID', mssql.Char(13), patientCID);
    //       await patientRequest.query(updatePatientQuery);

    //       // Create a new request for updating the pillbox
    //       const pillboxRequest = new mssql.Request(transaction);
    //       pillboxRequest.input('boxID', mssql.VarChar(10), boxID);
    //       await pillboxRequest.query(updatePillboxQuery);

    //       // Commit the transaction
    //       await transaction.commit();

    //       // Close the MSSQL connection
    //       await pool.close();

    //       // Return the updated patient
    //       return "Patient and pillbox updated successfully";
    //     } catch (transactionError) {
    //       // Rollback the transaction in case of error
    //       await transaction.rollback();

    //       // Close the MSSQL connection
    //       await pool.close();

    //       // Handle the error
    //       throw new Error('Failed to update patient and pillbox' + transactionError);
    //     }
    //   } catch (error) {
    //     // Handle the error
    //     throw new Error('Failed to update patient and pillbox' + error);
    //   }
    // },
    // unpairBox: async (_, { patientCID, boxID, unpairDetail }) => {
    //   console.log({ patientCID, boxID, unpairDetail })
    //   const youtubeLink = '15873675869561234567890123.mp4';
    //   try {
    //     // Connect to your MSSQL database.
    //     const pool = await mssql.connect(config);
    //     const request = pool.request();


    //     // Update SlotActivity table.
    //     await request.query(`INSERT INTO SlotActivity (patientCID, boxID, activityDate, activityTime, purpose, youtubeLink, isDotCompleted, isChecked)
    //     VALUES ('${patientCID}', '${boxID}', GETDATE(), GETDATE(), 'UNPAIR', '${youtubeLink}', 0, 0)`);

    //     // Update Unpair table.
    //     await request.query(`
    //       INSERT INTO Unpair (patientCID, boxID, activityDate, unpairDetail)
    //       VALUES ('${patientCID}', '${boxID}', GETDATE(), '${unpairDetail}')
    //     `);

    //     // Update Patient table.
    //     await request.query(`
    //       UPDATE Patient SET boxID = NULL WHERE patientCID = '${patientCID}'
    //     `);

    //     // Update Pillbox table.
    //     await request.query(`
    //       UPDATE Pillbox
    //       SET pillboxStatus = 'EMPTY', currentLocation = '13.7653,100.4536', lastUpdate = GETDATE()
    //       WHERE boxID = '${boxID}'
    //     `);

    //     // Return the unpair object.
    //     // const result = await request.query(`
    //     // SELECT * FROM Pillbox WHERE boxID = '${boxID}'
    //     // `);


    //     const result = await request.query(`SELECT * FROM Unpair WHERE unpairID = SCOPE_IDENTITY()`);
    //     console.log("unpairBox", result.recordset[0])
    //     return result.recordset[0];
    //   } catch (error) {
    //     // Handle any errors that occur during the execution.
    //     console.error('Error unpairing box:', error);
    //     throw new Error('An error occurred while unpairing the box.');
    //   }
    // },
    updateUser: async (_, args) => {
      const { CID, edits } = args;
      const pool = await mssql.connect(config);

      try {
        // Check if the new CID already exists for a different user
        if (edits.CID && edits.CID !== CID) {
          const checkCIDResult = await pool
            .request()
            .input('newCID', mssql.VarChar(50), edits.CID)
            .query('SELECT * FROM Userinfo WHERE CID = @newCID');

          if (checkCIDResult.recordset.length > 0) {
            throw new Error('CID already exists for another user. Please choose a different CID.');
          }
        }

        const queryResult = await pool
          .request()
          .input('CID', mssql.VarChar(50), CID)
          .query('SELECT * FROM Userinfo WHERE CID = @CID');

        if (queryResult.recordset.length === 0) {
          throw new Error('User not found');
        }

        const existingUserData = queryResult.recordset[0];

        const updatedUserData = {
          ...existingUserData,
          ...edits,
        };

        // Check if any fields are being updated
        const isAnyFieldUpdated = Object.keys(edits).some((key) => edits[key] !== existingUserData[key]);

        if (!isAnyFieldUpdated) {
          throw new Error('No updates were performed.');
        }

        console.log('UpdateduserData: ', updatedUserData);

        const updateQuery =
          'UPDATE Userinfo SET ' +
          Object.keys(edits)
            .filter((key) => key !== 'CID' && edits[key] !== undefined) // Exclude CID
            .map((key) => `${key} = @${key}`)
            .join(', ') +
          ' WHERE CID = @CID';

        const updateRequest = pool.request();
        Object.keys(edits)
          .filter((key) => edits[key] !== undefined)
          .forEach((key) => updateRequest.input(key, mssql.VarChar(255), updatedUserData[key]));

        await updateRequest.input('CID', mssql.VarChar(50), CID).query(updateQuery);

        // Return the updated user data
        return updatedUserData;
      } catch (error) {
        console.log('Failed to update user: ', error);
        throw error; // Rethrow the error to propagate it to the frontend
      } finally {
        mssql.close();
      }
    },
    loginUser: async (_, { input }) => {
      const { username, passwordHased } = input
      const pool = await mssql.connect(config)
      try {
        const result = await pool.request()
          .input('username', mssql.VarChar(50), username)
          .query(`
            SELECT UserAccount.*, Userinfo.userRole
            FROM UserAccount
            INNER JOIN Userinfo ON UserAccount.CID = Userinfo.CID
            WHERE UserAccount.username = @username
          `)
        if (result.recordset.length === 0) throw new AuthenticationError('Invalid username or password')

        const user = result.recordset[0]
        const isValidPassword = passwordHased === user.passwordHased

        if (!isValidPassword) throw new AuthenticationError('Invalid username ot password')

        return user

      } catch (error) {
        console.log('Cannot get user data by login: ', error)
        throw new AuthenticationError('Failed to authenticate');
      }
    },
    updateVideoStatus: async (_, { activityID, edit }) => {
      const pool = await mssql.connect(config)

      try {
        const queryResult = await pool.request()
          .input('activityID', mssql.BigInt(), activityID)
          .query('SELECT * FROM SlotActivity WHERE activityID = @activityID')

        if (queryResult.recordset.length === 0) {
          throw new Error('Video not found');
        }

        const videoData = queryResult.recordset[0]

        const updateVideo = {
          ...videoData,
          ...edit
        }

        console.log('Update Video status: ', updateVideo)

        const updateQuery = 'UPDATE SlotActivity SET ' +
          Object.keys(edit)
            .filter((key) => key !== `activityID` && edit[key] !== undefined)
            .map((key) => `${key} = @${key}`)
            .join(', ') +
          ' WHERE activityID = @activityID'

        console.log('update Query: ', updateQuery)

        const updateRequest = pool.request()
        Object.keys(edit)
          .filter((key) => edit[key] !== undefined)
          .forEach((key) => updateRequest.input(key, mssql.BigInt(), updateVideo[key])),

          await updateRequest.input('activityID', mssql.BigInt(), activityID)
            .query(updateQuery)

        return updateVideo

      } catch (error) {
        console.log(`Failed to update video status: ${error}`)
      }
    },
    updatePillEaten: async (_, { ActivityID, edit }) => {
      console.log('args: ', ActivityID)
      const pool = await mssql.connect(config)

      try {
        const result = await pool.request()
          .input('ActivityID', mssql.BigInt(), ActivityID)
          .query('SELECT * FROM dotActivity WHERE ActivityID = @ActivityID');

        if (result.recordset.length === 0) {
          throw new Error('Activity not found');
        }

        const activityData = result.recordset[0]

        const updatedActivity = {
          ...activityData,
          ...edit
        };

        const updateQuery = 'UPDATE dotActivity SET ' +
          Object.keys(edit)
            .filter((key) => key !== 'ActivityID' && edit[key] !== undefined)
            .map((key) => `${key} = @${key}`)
            .join(', ') +
          ' WHERE ActivityID = @ActivityID';

        const updateRequest = pool.request();
        Object.keys(edit)
          .filter((key) => edit[key] !== undefined)
          .forEach((key) => updateRequest.input(key, mssql.VarChar, updatedActivity[key]));

        await updateRequest.input('ActivityID', mssql.BigInt(), ActivityID)
          .query(updateQuery);

        return updatedActivity;

      } catch (error) {
        console.log('Failed to update pillEaten: ', error.message)
      }
    },
    updateStatusFotFistTime: async (_, { date_, cid, edit }) => {
      try {
        const isComplete = edit.isComplete
        const pool = await mssql.connect(config);

        const result = await pool.request()
          .input('cid', mssql.VarChar, cid)
          .input('date_', mssql.VarChar, date_)
          .query('SELECT * FROM dayActivity WHERE cid = @cid AND date_ = @date_')

        if (result.recordset.length === 0) {
          throw new Error('Activity not found');
        }

        const updateRequest = pool.request();
        updateRequest.input('isComplete', mssql.VarChar, isComplete);
        updateRequest.input('cid', mssql.VarChar, cid);
        updateRequest.input('date_', mssql.VarChar, date_);

        const updateQuery = `
          UPDATE dayActivity
          SET isComplete = @isComplete
          WHERE cid = @cid AND date_ = @date_
        `;

        await updateRequest.query(updateQuery);

        return { ...result.recordset[0], ...edit }

      } catch (error) {
        console.log('Failed to update isCheck status: ', error.message)
      }
    },
    updateIsCompleteForDay: async (_, { date, cid, ActivityID }) => {
      try {
        console.log('ActivityID: ', ActivityID)
        console.log('date: ', date)
        const pool = await mssql.connect(config);

        const dotActivitiesResult = await pool.request()
          .input('date_', mssql.VarChar, date)
          .input('cid', mssql.VarChar, cid)
          .query('SELECT * FROM dotActivity WHERE date_ = @date_ AND cid = @cid');

        console.log('dotActivitiesResult: ', dotActivitiesResult)

        let totalPillEaten = 0;
        dotActivitiesResult.recordset.forEach(activity => {
          totalPillEaten += parseInt(activity.pillEaten);
        });

        console.log('totalPillEaten: ', totalPillEaten)

        const dayActivityResult = await pool.request()
          .input('date_', mssql.VarChar, date)
          .input('cid', mssql.VarChar, cid)
          .query('SELECT pills_no, isComplete FROM dayActivity WHERE date_ = @date_ AND cid = @cid');

        console.log('dayActivityResult: ', dayActivityResult)

        const { pills_no, isComplete } = dayActivityResult.recordset[0];

        console.log('pill_no: ', pills_no)
        console.log('isComplete: ', isComplete)

        const updatedIsComplete = totalPillEaten === parseInt(pills_no) ? 'COMPLETED' : 'INCOMPLETED';

        const updateQuery = `
          UPDATE dayActivity
          SET isComplete = @isComplete
          WHERE date_ = @date_ AND cid = @cid
        `;

        const updateRequest = pool.request();
        updateRequest.input('isComplete', mssql.VarChar, updatedIsComplete);
        updateRequest.input('date_', mssql.VarChar, date);
        updateRequest.input('cid', mssql.VarChar, cid);
        await updateRequest.query(updateQuery);

        return { isComplete: updatedIsComplete };

      } catch (error) {
        console.log('Failed to update pillEaten status: ', error.message)
      }
    },
  },
  UserAccountWithUserInfo: {
    getCID: (parent) => parent.CID[0]
  }
};

const server = new ApolloServer({ typeDefs, resolvers, host: '0.0.0.0' });

server.listen(5000).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

function convertTimeToServerTimezone(inputTime) {
  const serverTimezoneOffset = 7 * 60 * 60 * 1000; // GMT+7 (Bangkok) timezone offset in milliseconds
  const [hours, minutes, seconds] = inputTime.split(':');
  const timeObject = new Date();
  timeObject.setHours(hours);
  timeObject.setMinutes(minutes);
  timeObject.setSeconds(seconds);
  const convertedTime = new Date(timeObject.getTime() - serverTimezoneOffset);
  return convertedTime;
}