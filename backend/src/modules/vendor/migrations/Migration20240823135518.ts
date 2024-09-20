import { Migration } from "@mikro-orm/migrations";

export class Migration20240823135518 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table if not exists "vendor" ("id" text not null, "handle" text not null, "is_open" boolean not null default false, "name" text not null, "description" text null, "phone" text not null, "email" text not null, "address" text not null, "image_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table if not exists "vendor_admin" ("id" text not null, "first_name" text not null, "last_name" text not null, "email" text not null, "avatar_url" text null, "vendor_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vendor_admin_pkey" primary key ("id"));'
    );
    this.addSql(
      'CREATE INDEX IF NOT EXISTS "IDX_vendor_admin_vendor_id" ON "vendor_admin" (vendor_id) WHERE deleted_at IS NULL;'
    );
    this.addSql(
      'alter table if exists "vendor_admin" add constraint "vendor_admin_vendor_id_foreign" foreign key ("vendor_id") references "vendor" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table if exists "vendor_admin" drop constraint if exists "vendor_admin_vendor_id_foreign";'
    );
    this.addSql('drop table if exists "vendor" cascade;');
    this.addSql('drop table if exists "vendor_admin" cascade;');
  }
}
