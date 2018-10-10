import * as Sequelize from 'sequelize';
import { RG_DB_NAME, RG_DB_USER, RG_DB_PASS, RG_DB_PORT, RG_DB_HOST } from '../common/Constants';

export interface IDbContext {
    Sequelize: Sequelize.Sequelize;
}

export class DbContext implements IDbContext {

    private static instance: IDbContext = null;

    public Sequelize: Sequelize.Sequelize;

    public static getContext(): Sequelize.Sequelize {
        if (DbContext.instance == null) {
            DbContext.instance = new DbContext();
        }

        return DbContext.instance.Sequelize;
    }

    private constructor() {

        const connectionLimit = 10;

        this.Sequelize = new Sequelize(RG_DB_NAME
            , RG_DB_USER
            , RG_DB_PASS
            , {
                host: RG_DB_HOST
                , dialect: 'mysql'
                , port: parseInt(RG_DB_PORT || '3306', 10)
                , pool : {
                    max: connectionLimit,
                    min: 0,
                    idle: 10000
                }
            });
    }

}
