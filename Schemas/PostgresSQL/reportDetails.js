module.exports = function(pg_con, DataTypes){
    return pg_con.define('ASK_REPORTS_GENERATED',{
        ID:{
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
      },
        MOBILE:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        BO_CODE:{
            type: DataTypes.STRING,
            allowNull: true
        },
	BO_CODE_Old:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        TOKEN: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        PAN: {
            type: DataTypes.STRING,
            allowNull: true
        },
        MENUID: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        REPORT_DETAILS: {
            type: DataTypes.JSON,
            allowNull: true
        },
        REPORT_NAME: {
            type: DataTypes.STRING,
            allowNull: true
        },
        CREATE_DATE:{
            allowNull: true,
            type: 'TIMESTAMP',
            defaultValue: pg_con.literal('CURRENT_TIMESTAMP'),
        },
	ROLE:{
          type: DataTypes.STRING,
          allowNull: true
        },
	REPORT_STATUS:{
          type: DataTypes.STRING,
          allowNull: true
        }
    },{
        tableName: 'ASK_REPORTS_GENERATED',
        timestamps: false
    })
}
