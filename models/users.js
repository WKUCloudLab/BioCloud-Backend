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
    users.associate = (models) => {
        user.hasMany(models.Jobs, {
          as: 'user_id',
          foreignKey: 'user_id',
        })
      };
      return users;
    };

