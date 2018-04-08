module.exports = (sequelize, DataTypes) => {
    const jobs = sequelize.define('jobs', {
        id: {
            type: DataTypes.INT,
            allowNull: false, 
        },
        name:{
            type: DataTypes.INT,
            allowNull: false,
        }
        status:{
            type: DataTypes.ENUM('INIT','ENQUEUE','INPROCESS','COMPLETE','FAILED'),
            allowNull:false,
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        next_job: {
            type: DataTypes.INT,
            allowNull: false,
        },
        script_id: {
            type: DataTypes.STRING
        }
        