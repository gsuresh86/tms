# Entity Relationship Diagram (ERD)

Below is a textual representation of the Entity Relationship Diagram for the Ticket Management System database.

```
+----------------+       +------------------+       +-------------+
|    tickets     |       |  ticket_comments |       |     tags    |
+----------------+       +------------------+       +-------------+
| id (PK)        |       | id (PK)          |       | id (PK)     |
| title          |       | ticket_id (FK)   |------>| name        |
| description    |       | content          |       | color       |
| status         |<------| user_id (FK)     |       | created_at  |
| priority       |       | created_at       |       +-------------+
| assignee_id    |       | updated_at       |             ^
| created_by     |       +------------------+             |
| created_at     |                                        |
| updated_at     |       +------------------+             |
+----------------+       |  ticket_history  |             |
        ^                +------------------+             |
        |                | id (PK)          |             |
        |                | ticket_id (FK)   |------>      |
        |                | field_name       |             |
        |                | old_value        |             |
        |                | new_value        |             |
        |                | changed_by       |             |
        |                | created_at       |             |
        |                +------------------+             |
        |                                                 |
        |                +------------------+             |
        |                |   ticket_tags    |             |
        |                +------------------+             |
        +--------------->| ticket_id (PK,FK)|-------------+
                         | tag_id (PK,FK)   |
                         | created_at       |
                         +------------------+
```

## Relationships

1. **One-to-Many: Tickets to Comments**
   - A ticket can have multiple comments
   - Each comment belongs to exactly one ticket

2. **One-to-Many: Tickets to History**
   - A ticket can have multiple history records
   - Each history record belongs to exactly one ticket

3. **Many-to-Many: Tickets to Tags**
   - A ticket can have multiple tags
   - A tag can be applied to multiple tickets
   - The `ticket_tags` junction table manages this relationship

## Key Constraints

- **Primary Keys (PK)**: Uniquely identify each record in a table
- **Foreign Keys (FK)**: Establish relationships between tables
- **Composite Primary Keys**: In the `ticket_tags` table, the combination of `ticket_id` and `tag_id` forms a composite primary key

## Data Integrity

The schema enforces several data integrity rules:

1. **Referential Integrity**: Foreign key constraints ensure that relationships between tables remain valid
   - When a ticket is deleted, all its comments, history records, and tag associations are automatically deleted (CASCADE)

2. **Domain Integrity**: Check constraints limit the values that can be stored
   - `status` must be one of: 'open', 'in_progress', 'resolved', 'closed'
   - `priority` must be one of: 'low', 'medium', 'high', 'critical'

3. **Entity Integrity**: Primary key constraints ensure each record is uniquely identifiable

## Temporal Data

Several timestamp fields track when records are created and modified:

- `created_at`: Automatically set when a record is created
- `updated_at`: Automatically updated when a record is modified (via triggers) 