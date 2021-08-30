module.exports = function(pg_con, DataTypes){
    console.log("====Userdetails table===")
    return pg_con.define('ASK_USER_DETAILS',{
        ID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        PHONE_NO:{
            type: DataTypes.STRING(10),
	    allowNull: true
        },
        WHATSAPP_PHONE: {
            type: DataTypes.STRING(10),
	    allowNull: true
        },
        EMAIL_ID: {
            type: DataTypes.STRING(256),
	    allowNull: true
        },
        USER_RATING: {
            type: DataTypes.INTEGER,
	    allowNull: true
        },
        CREATED_DATE:{
            type: DataTypes.DATE,
	    allowNull: true
        },
        UPDATED_DATE:{
            type: DataTypes.DATE,
	    allowNull: true
        },
        // VERIFIED: {
        //     type: DataTypes.BOOLEAN,
        //     defaultVale: false,
        //     allowNull: false
        // },
        OTP:{
            type: DataTypes.INTEGER,
	    allowNull: false
        }
    },{
        tableName: 'ASK_USER_DETAILS',
        timestamps: false
    })
}