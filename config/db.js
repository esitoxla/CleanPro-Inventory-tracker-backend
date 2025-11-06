import { Sequelize } from "sequelize";

const sequelize = new Sequelize("inventory_clean", "root", "toxla@2025", {
    host: "localhost",
    dialect: "mysql"
});

async function testConnection() {
    try {
        await sequelize.authenticate()
        console.log("myaql connected!")
    } catch (error) {
       console.error("Unable to connect to mysql", error) 
    }
}

testConnection()

export default sequelize;