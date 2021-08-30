module.exports = function(pg_con, DataTypes) {
    return pg_con.define("ASK_CRM_ACCESS_TOKEN",{
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            defaultValue: 1,
            allowNull: false
        },
        ACCESS_TOKEN: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        CREATED_DATE:{
            type: DataTypes.DATE,
            allowNull: false
        }
    },{
        tableName: 'ASK_CRM_ACCESS_TOKEN',
        timestamps: false
    })
}