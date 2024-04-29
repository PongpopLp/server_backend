const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType, Kind } = require('graphql');
const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'ddotv3_password',
  server: '0.tcp.ap.ngrok.io',
  port: 18901,
  database: 'dDOTv3',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
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
// const config = {
//   user: 'sa',
//   password: 'ddotv3_password',
//   server: '192.168.0.114',
//   // port: 10066,
//   database: 'dDOTv3',
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// };

const typeDefs = gql`
  scalar Date
  scalar Time

  type Query {
    getUserInfo(cid: String!): UserInfo
    getColorBlind(cid: String!): [ColorBlind]
    getSideEffect(cid: String!): [SideEffect]
    getAdmissionDetails(cid: String!): Admission
    getObservationDetails(cid: String!): [Observation]

    getDayActivity(cid: String!): [DayActivity]
  }
  

  type Mutation {
    addSideEffect(input: AddSideEffectInput): SideEffect
    addColorBlind(input: AddColorBlindInput): ColorBlind
    addDayActivity(input: AddDayActivityInput): DayActivity
    updateDayActivityPillsNo(input: UpdateDayActivityPillsNoInput!): DayActivity
    addDotActivity(input: AddDotActivityInput): DotActivity
  }

  input AddColorBlindInput {
    patientCID: String!
    colorBlindDate: Date
    colorBlindTime: Time
    correct: Int
    incorrect: Int
  }

  type DotActivity {
    dotActivityID: Int!
    date: Date!
    time: Time!
    videoLink: String!
    pillEaten: Int!
    cid: String!
  }

  type ColorBlind {
    colorBlindID: Int!
    patientCID: String
    colorBlindDate: Date
    colorBlindTime: Time
    correct: Int
    incorrect: Int
  }

  type Admission {
    admissionID: Int!
    patientCID: String
    localHospitalNumber: String
    fromLocalHospital: String
    fromAdmission: Int
    startDate: Date
    endDate: Date
  }

  input AddSideEffectInput {
    patientCID: String!
    effectDate: Date
    effectTime: Time
    effectDesc: String
  }

  type SideEffect {
    sideEffectID: Int!
    patientCID: String
    effectDate: Date
    effectTime: Time
    effectDesc: String
  }


  type UserInfo {
    CID: String!
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

  type Observation {
    patientCID: String!
    tbNumber: String!
    daysTakenPill: Int!
    lastVisitedDate: Date!
    registeredBy: String!
    boxID: String!
  }

  type DayActivity {
    date: Date!
    pillsNo: Int!
    cid: String!
    isComplete: String!
  }

  input AddDayActivityInput {
    date: Date!
    pillsNo: Int!
    cid: String!
    isComplete: String!
  }

  input UpdateDayActivityPillsNoInput {
    cid: String!
    date: Date!
    newPillsNo: Int!
  }

  input AddDotActivityInput {
    date: Date!
    time: Time!
    videoLink: String!
    pillEaten: Int!
    cid: String!
  }
`;

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Custom scalar type for representing dates',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),

  // Time: new GraphQLScalarType({
  //   name: 'Time',
  //   description: 'Custom scalar type for representing times',
  //   parseValue(value) {
  //     const inputTime = new Date(`1970-01-01T${value}`);
  //     // Adjust the time to GMT+7
  //     const gmtPlus7Time = new Date(inputTime.getTime() + 7 * 60 * 60 * 1000);
  //     print("inputTime.getTime():",inputTime.getTime());
  //     return gmtPlus7Time;
  //   },
  //   serialize(value) {
  //     return value.toTimeString().split(' ')[0];
  //   },
  //   parseLiteral(ast) {
  //     if (ast.kind === Kind.STRING) {
  //       const inputTime = new Date(`1970-01-01T${ast.value}`);
  //       // Adjust the time to GMT+7
  //       const gmtPlus7Time = new Date(inputTime.getTime() + 7 * 60 * 60 * 1000);
  //       print("inputTime.getTime():",inputTime.getTime());
  //       return gmtPlus7Time;
  //     }
  //     return null;
  //   },
  // }),
  Time: new GraphQLScalarType({
    name: 'Time',
    description: 'Custom scalar type for representing times',
    parseValue(value) {
      // Parse the value from the client input
      return value; // Since we're not modifying the value, return it as is
    },
    serialize(value) {
      // Serialize the value sent to the client
      return value; // Again, we're not modifying the value, so return it as is
    },
    parseLiteral(ast) {
      // Parse the literal AST value
      if (ast.kind === Kind.STRING) {
        // Ensure the AST kind is a string
        return ast.value; // Return the string value
      }
      return null; // Return null if the AST kind is not a string
    },
  }),
  
  Query: {
    getUserInfo: async (_, { cid }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM Userinfo WHERE CID = ${cid}`;
        return result.recordset[0];
      } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
      } finally {
        sql.close();
      }
    },

    getColorBlind: async (_, { cid }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM ColorBlind WHERE patientCID = ${cid}`;
        return result.recordset;
      } catch (error) {
        console.error('Error fetching ColorBlind data:', error);
        throw error;
      } finally {
        sql.close();
      }
    },
  
    getSideEffect: async (_, { cid }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM SideEffect WHERE patientCID = ${cid}`;
        return result.recordset;
      } catch (error) {
        console.error('Error fetching SideEffect data:', error);
        throw error;
      } finally {
        sql.close();
      }
    },

    getAdmissionDetails: async (_, { cid }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM Admission WHERE patientCID = ${cid}`;
        return result.recordset[0];
      } catch (error) {
        console.error('Error fetching admission details:', error);
        throw error;
      } finally {
        sql.close();
      }
    },

    getObservationDetails: async (_, { cid }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`
          SELECT * FROM Patient
          WHERE patientCID = ${cid}`;
        return result.recordset;
      } catch (error) {
        console.error('Error fetching observation details:', error);
        throw error;
      } finally {
        sql.close();
      }
    },

    getDayActivity: async (_, { cid }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`
          SELECT date_, pills_no AS pillsNo, isComplete, cid FROM DayActivity WHERE cid = ${cid};
        `;
        return result.recordset.map(row => ({
          date: row.date_, // Assuming `date_` is the name of the column in your database
          pillsNo: row.pillsNo,
          isComplete: row.isComplete,
          cid: row.cid
        }));
      } catch (error) {
        console.error('Error fetching DayActivity data:', error);
        throw error;
      } finally {
        sql.close();
      }
    },
    
  },

  Mutation: {

    addSideEffect: async (_, { input }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`
          INSERT INTO SideEffect (patientCID, effectDate, effectTime, effectDesc)
          VALUES (${input.patientCID}, ${input.effectDate}, ${input.effectTime}, ${input.effectDesc});
          SELECT SCOPE_IDENTITY() as sideEffectID;
        `;

        const sideEffectID = result.recordset[0].sideEffectID;
        const newSideEffect = { sideEffectID, ...input };
        return newSideEffect;
      } catch (error) {
        console.error('Error adding side effect:', error);
        throw error;
      } finally {
        sql.close();
      }
    },

    addColorBlind: async (_, { input }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`
          INSERT INTO ColorBlind (patientCID, colorBlindDate, colorBlindTime, correct, incorrect)
          VALUES (${input.patientCID}, ${input.colorBlindDate}, ${input.colorBlindTime}, ${input.correct}, ${input.incorrect});
          SELECT SCOPE_IDENTITY() as colorBlindID;
        `;

        const colorBlindID = result.recordset[0].colorBlindID;
        const newColorBlind = { colorBlindID, ...input };
        return newColorBlind;
      } catch (error) {
        console.error('Error adding color blind result:', error);
        throw error;
      } finally {
        sql.close();
      }
    },

    addDayActivity: async (_, { input }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`
          INSERT INTO DayActivity (date_, pills_no, isComplete, cid)
          VALUES (${input.date}, ${input.pillsNo}, ${input.isComplete}, ${input.cid});
          SELECT SCOPE_IDENTITY() as dayActivityID;
        `;

        const dayActivityID = result.recordset[0].dayActivityID;
        return {
          dayActivityID,
          ...input,
        };
      } catch (error) {
        console.error('Error adding day activity:', error);
        throw error;
      } finally {
        sql.close();
      }
    },

    updateDayActivityPillsNo: async (_, { input }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`
          UPDATE DayActivity
          SET pills_no = ${input.newPillsNo}
          WHERE cid = ${input.cid} AND date_ = ${input.date};
        `;
  
        // Check if any row was affected by the update
        if (result.rowsAffected[0] === 0) {
          throw new Error('No matching DayActivity found for update.');
        }
  
        // Return the updated DayActivity
        return {
          cid: input.cid,
          date: input.date,
          pillsNo: input.newPillsNo,
        };
      } catch (error) {
        console.error('Error updating day activity pillsNo:', error);
        throw error;
      } finally {
        sql.close();
      }
    },

    addDotActivity: async (_, { input }) => {
      try {
        await sql.connect(config);
        const result = await sql.query`
          INSERT INTO DotActivity (date_, time_, videoLink, pillEaten, cid)
          VALUES (${input.date}, ${input.time}, ${input.videoLink}, ${input.pillEaten}, ${input.cid});
          SELECT SCOPE_IDENTITY() as dotActivityID;
        `;

        const dotActivityID = result.recordset[0].dotActivityID;
        return {
          dotActivityID,
          ...input,
        };
      } catch (error) {
        console.error('Error adding DOT activity:', error);
        throw error;
      } finally {
        sql.close();
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
