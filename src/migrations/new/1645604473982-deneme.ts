import {MigrationInterface, QueryRunner} from "typeorm";

export class deneme1645604473982 implements MigrationInterface {
    name = 'deneme1645604473982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classes" ADD "isActive" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classes" DROP COLUMN "isActive"`);
    }

}
