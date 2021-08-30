module.exports = function(pg_con, DataTypes){
    return pg_con.define('ASK_NEFT_TRANSACTIONS',{
        ACCOUNT_SF_ID:{
            type: DataTypes.STRING,
            allowNull: true
        },
        STRATEGY:{
            type: DataTypes.STRING,
            allowNull: true
        },
        BANK_OFFICE_EQUITY_CODE: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ACCOUNT_NUMBER: {
            type: DataTypes.STRING,
            allowNull: true
        },
        TRANSACTION_ID: {
          primaryKey: true,
            type: DataTypes.INTEGER,
            allowNull: false
        },
        DISTIBUTOR: {
            type: DataTypes.STRING,
            allowNull: true
        },
        LEAD_ID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ASK_RM: {
            type: DataTypes.STRING,
            allowNull: true
        },
        NAME: {
            type: DataTypes.STRING,
            allowNull: true
        },
        IFSC: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CURRENCY: {
            type: DataTypes.STRING,
            allowNull: true
        },
        TRANSACT_TIME:{
            allowNull: true,
            type: 'TIMESTAMP',
            defaultValue: pg_con.literal('CURRENT_TIMESTAMP'),
        },
        AMOUNT: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        IS_CUSTOMER_FLOW: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        IS_LIQUID_FLOW: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        STP_AMOUNT: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
       NO_OF_INSTALLMENTS  : {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        FINANCIAL_STRATEGY: {
          type: DataTypes.STRING,
          allowNull: true
        },
        STP_START_MONTH: {
          type: DataTypes.STRING,
          allowNull: true
        },
        STRATEGY_ID: {
          type: DataTypes.STRING,
          allowNull: true
        },
        CUSTODY_NAME:{
          type: DataTypes.STRING,
          allowNull: true
        }
	
    },{
        tableName: 'ASK_NEFT_TRANSACTIONS',
        timestamps: false    })
}