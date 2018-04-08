module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        name:{
            type: DataTypes.STRING,
            allowNull: false,      
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING
        }
    });
    User.associate = (models) => {
        User.hasMany(models.Exercise, {
          as: 'userID',
          foreignKey: 'userID',
        })
      };
      return User;
    };

