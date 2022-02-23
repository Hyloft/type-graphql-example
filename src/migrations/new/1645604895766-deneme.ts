import {MigrationInterface, QueryRunner} from "typeorm";

export class deneme1645604895766 implements MigrationInterface {
    name = 'deneme1645604895766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classes" RENAME COLUMN "isActive" TO "isOpen"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classes" RENAME COLUMN "isOpen" TO "isActive"`);
    }

}
