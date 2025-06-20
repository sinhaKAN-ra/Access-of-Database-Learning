import { DatabaseType } from '@/types/database';

export interface TableSchema {
  name: string;
  columns: ColumnDefinition[];
  primaryKey: string[];
  foreignKeys: ForeignKeyDefinition[];
  indexes: IndexDefinition[];
  constraints: ConstraintDefinition[];
}

export interface ColumnDefinition {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  description?: string;
  length?: number;
  precision?: number;
  scale?: number;
}

export interface ForeignKeyDefinition {
  columnName: string;
  referencedTable: string;
  referencedColumn: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
}

export interface IndexDefinition {
  name: string;
  columns: string[];
  unique: boolean;
  type?: 'BTREE' | 'HASH' | 'GIN' | 'GIST';
}

export interface ConstraintDefinition {
  name: string;
  type: 'CHECK' | 'UNIQUE' | 'NOT NULL';
  definition: string;
}

export interface DatabaseSchema {
  name: string;
  tables: TableSchema[];
  relationships: RelationshipDefinition[];
  views: ViewDefinition[];
  functions: FunctionDefinition[];
}

export interface RelationshipDefinition {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';
  name?: string;
}

export interface ViewDefinition {
  name: string;
  query: string;
  description?: string;
}

export interface FunctionDefinition {
  name: string;
  parameters: ParameterDefinition[];
  returnType: string;
  body: string;
  language: string;
}

export interface ParameterDefinition {
  name: string;
  type: string;
  defaultValue?: string;
}

export interface UseCaseAnalysis {
  entities: string[];
  relationships: string[];
  businessRules: string[];
  dataFlow: string[];
  scalingConsiderations: string[];
}

export class AISchemaDesignService {
  private commonPatterns = {
    'e-commerce': {
      entities: ['User', 'Product', 'Category', 'Order', 'OrderItem', 'Payment', 'Address', 'Review'],
      relationships: [
        { from: 'User', to: 'Order', type: 'ONE_TO_MANY' },
        { from: 'Order', to: 'OrderItem', type: 'ONE_TO_MANY' },
        { from: 'Product', to: 'OrderItem', type: 'ONE_TO_MANY' },
        { from: 'Category', to: 'Product', type: 'ONE_TO_MANY' },
        { from: 'User', to: 'Address', type: 'ONE_TO_MANY' },
        { from: 'User', to: 'Review', type: 'ONE_TO_MANY' },
        { from: 'Product', to: 'Review', type: 'ONE_TO_MANY' },
        { from: 'Order', to: 'Payment', type: 'ONE_TO_ONE' }
      ]
    },
    'blog': {
      entities: ['User', 'Post', 'Category', 'Tag', 'Comment', 'Media'],
      relationships: [
        { from: 'User', to: 'Post', type: 'ONE_TO_MANY' },
        { from: 'Post', to: 'Comment', type: 'ONE_TO_MANY' },
        { from: 'User', to: 'Comment', type: 'ONE_TO_MANY' },
        { from: 'Category', to: 'Post', type: 'ONE_TO_MANY' },
        { from: 'Post', to: 'Tag', type: 'MANY_TO_MANY' },
        { from: 'Post', to: 'Media', type: 'ONE_TO_MANY' }
      ]
    },
    'crm': {
      entities: ['Contact', 'Company', 'Deal', 'Activity', 'Task', 'Note', 'User', 'Pipeline'],
      relationships: [
        { from: 'Company', to: 'Contact', type: 'ONE_TO_MANY' },
        { from: 'Contact', to: 'Deal', type: 'ONE_TO_MANY' },
        { from: 'User', to: 'Deal', type: 'ONE_TO_MANY' },
        { from: 'Deal', to: 'Activity', type: 'ONE_TO_MANY' },
        { from: 'Contact', to: 'Task', type: 'ONE_TO_MANY' },
        { from: 'Contact', to: 'Note', type: 'ONE_TO_MANY' },
        { from: 'Pipeline', to: 'Deal', type: 'ONE_TO_MANY' }
      ]
    },
    'social-media': {
      entities: ['User', 'Post', 'Comment', 'Like', 'Follow', 'Message', 'Group', 'Event'],
      relationships: [
        { from: 'User', to: 'Post', type: 'ONE_TO_MANY' },
        { from: 'Post', to: 'Comment', type: 'ONE_TO_MANY' },
        { from: 'User', to: 'Comment', type: 'ONE_TO_MANY' },
        { from: 'User', to: 'Like', type: 'ONE_TO_MANY' },
        { from: 'Post', to: 'Like', type: 'ONE_TO_MANY' },
        { from: 'User', to: 'Follow', type: 'ONE_TO_MANY' },
        { from: 'User', to: 'Message', type: 'ONE_TO_MANY' },
        { from: 'User', to: 'Group', type: 'MANY_TO_MANY' }
      ]
    }
  };

  async analyzeUseCase(description: string): Promise<UseCaseAnalysis> {
    const lowerDesc = description.toLowerCase();
    
    // Extract entities from description
    const entities = this.extractEntities(lowerDesc);
    
    // Extract relationships
    const relationships = this.extractRelationships(lowerDesc, entities);
    
    // Extract business rules
    const businessRules = this.extractBusinessRules(lowerDesc);
    
    // Extract data flow
    const dataFlow = this.extractDataFlow(lowerDesc);
    
    // Scaling considerations
    const scalingConsiderations = this.extractScalingConsiderations(lowerDesc);

    return {
      entities,
      relationships,
      businessRules,
      dataFlow,
      scalingConsiderations
    };
  }

  async generateSchema(
    useCase: string, 
    requirements: any, 
    database: DatabaseType
  ): Promise<DatabaseSchema> {
    const analysis = await this.analyzeUseCase(useCase);
    
    // Determine the pattern based on use case
    const pattern = this.detectPattern(useCase);
    const basePattern = this.commonPatterns[pattern];
    
    // Generate tables based on entities
    const tables = this.generateTables(analysis.entities, basePattern, database);
    
    // Generate relationships
    const relationships = this.generateRelationships(analysis.relationships, basePattern);
    
    // Generate views for common queries
    const views = this.generateViews(tables, database);
    
    // Generate functions/procedures if supported
    const functions = this.generateFunctions(tables, database);

    return {
      name: `${useCase.replace(/\s+/g, '_').toLowerCase()}_db`,
      tables,
      relationships,
      views,
      functions
    };
  }

  private extractEntities(description: string): string[] {
    const commonEntities = [
      'user', 'customer', 'product', 'order', 'payment', 'address', 'category',
      'post', 'comment', 'article', 'blog', 'tag', 'media', 'image', 'file',
      'company', 'contact', 'deal', 'lead', 'opportunity', 'task', 'activity',
      'invoice', 'transaction', 'account', 'profile', 'setting', 'notification',
      'message', 'chat', 'conversation', 'group', 'team', 'project', 'event',
      'booking', 'reservation', 'appointment', 'schedule', 'calendar',
      'inventory', 'stock', 'warehouse', 'supplier', 'vendor', 'purchase'
    ];

    const foundEntities = commonEntities.filter(entity => 
      description.includes(entity) || description.includes(entity + 's')
    );

    // Add some default entities if none found
    if (foundEntities.length === 0) {
      foundEntities.push('user', 'item', 'category');
    }

    return [...new Set(foundEntities)].map(entity => 
      entity.charAt(0).toUpperCase() + entity.slice(1)
    );
  }

  private extractRelationships(description: string, entities: string[]): string[] {
    const relationships = [];
    
    // Look for relationship keywords
    const relationshipPatterns = [
      'belongs to', 'has many', 'has one', 'contains', 'includes',
      'associated with', 'linked to', 'connected to', 'part of'
    ];

    relationshipPatterns.forEach(pattern => {
      if (description.includes(pattern)) {
        relationships.push(`Entities are ${pattern}`);
      }
    });

    // Generate some default relationships
    if (entities.includes('User') && entities.includes('Order')) {
      relationships.push('User has many Orders');
    }
    if (entities.includes('Category') && entities.includes('Product')) {
      relationships.push('Category has many Products');
    }

    return relationships;
  }

  private extractBusinessRules(description: string): string[] {
    const rules = [];
    
    // Look for business rule keywords
    if (description.includes('must') || description.includes('required')) {
      rules.push('Required field validation needed');
    }
    if (description.includes('unique') || description.includes('duplicate')) {
      rules.push('Unique constraints required');
    }
    if (description.includes('audit') || description.includes('track')) {
      rules.push('Audit trail required');
    }
    if (description.includes('permission') || description.includes('access')) {
      rules.push('Access control needed');
    }

    return rules;
  }

  private extractDataFlow(description: string): string[] {
    const flows = [];
    
    if (description.includes('create') || description.includes('add')) {
      flows.push('Data creation workflow');
    }
    if (description.includes('update') || description.includes('edit')) {
      flows.push('Data modification workflow');
    }
    if (description.includes('delete') || description.includes('remove')) {
      flows.push('Data deletion workflow');
    }
    if (description.includes('search') || description.includes('find')) {
      flows.push('Data retrieval workflow');
    }

    return flows;
  }

  private extractScalingConsiderations(description: string): string[] {
    const considerations = [];
    
    if (description.includes('million') || description.includes('large scale')) {
      considerations.push('Horizontal scaling required');
      considerations.push('Database sharding consideration');
    }
    if (description.includes('real-time') || description.includes('live')) {
      considerations.push('Real-time data synchronization');
    }
    if (description.includes('global') || description.includes('worldwide')) {
      considerations.push('Multi-region deployment');
    }

    return considerations;
  }

  private detectPattern(useCase: string): string {
    const lowerUseCase = useCase.toLowerCase();
    
    if (lowerUseCase.includes('ecommerce') || lowerUseCase.includes('shop') || lowerUseCase.includes('store')) {
      return 'e-commerce';
    }
    if (lowerUseCase.includes('blog') || lowerUseCase.includes('cms') || lowerUseCase.includes('content')) {
      return 'blog';
    }
    if (lowerUseCase.includes('crm') || lowerUseCase.includes('customer') || lowerUseCase.includes('sales')) {
      return 'crm';
    }
    if (lowerUseCase.includes('social') || lowerUseCase.includes('community') || lowerUseCase.includes('network')) {
      return 'social-media';
    }
    
    return 'e-commerce'; // Default pattern
  }

  private generateTables(entities: string[], pattern: any, database: DatabaseType): TableSchema[] {
    const tables: TableSchema[] = [];

    entities.forEach(entity => {
      const table = this.generateTableForEntity(entity, database);
      tables.push(table);
    });

    return tables;
  }

  private generateTableForEntity(entity: string, database: DatabaseType): TableSchema {
    const tableName = entity.toLowerCase() + 's';
    const columns: ColumnDefinition[] = [];

    // Always add ID column
    if (database.type === 'SQL') {
      columns.push({
        name: 'id',
        type: 'UUID',
        nullable: false,
        defaultValue: 'gen_random_uuid()',
        description: 'Primary key'
      });
    } else if (database.type === 'NoSQL') {
      columns.push({
        name: '_id',
        type: 'ObjectId',
        nullable: false,
        description: 'Document ID'
      });
    }

    // Add common columns based on entity type
    const commonColumns = this.getCommonColumnsForEntity(entity, database);
    columns.push(...commonColumns);

    // Add timestamps
    columns.push(
      {
        name: 'created_at',
        type: database.type === 'SQL' ? 'TIMESTAMP' : 'Date',
        nullable: false,
        defaultValue: database.type === 'SQL' ? 'CURRENT_TIMESTAMP' : 'new Date()',
        description: 'Creation timestamp'
      },
      {
        name: 'updated_at',
        type: database.type === 'SQL' ? 'TIMESTAMP' : 'Date',
        nullable: false,
        defaultValue: database.type === 'SQL' ? 'CURRENT_TIMESTAMP' : 'new Date()',
        description: 'Last update timestamp'
      }
    );

    return {
      name: tableName,
      columns,
      primaryKey: database.type === 'SQL' ? ['id'] : ['_id'],
      foreignKeys: [],
      indexes: this.generateIndexesForTable(tableName, columns, database),
      constraints: []
    };
  }

  private getCommonColumnsForEntity(entity: string, database: DatabaseType): ColumnDefinition[] {
    const columns: ColumnDefinition[] = [];
    const stringType = database.type === 'SQL' ? 'VARCHAR' : 'String';
    const textType = database.type === 'SQL' ? 'TEXT' : 'String';
    const boolType = database.type === 'SQL' ? 'BOOLEAN' : 'Boolean';
    const numberType = database.type === 'SQL' ? 'INTEGER' : 'Number';

    switch (entity.toLowerCase()) {
      case 'user':
        columns.push(
          { name: 'email', type: stringType, nullable: false, length: 255, description: 'User email address' },
          { name: 'username', type: stringType, nullable: true, length: 100, description: 'Username' },
          { name: 'first_name', type: stringType, nullable: true, length: 100, description: 'First name' },
          { name: 'last_name', type: stringType, nullable: true, length: 100, description: 'Last name' },
          { name: 'password_hash', type: stringType, nullable: false, length: 255, description: 'Hashed password' },
          { name: 'is_active', type: boolType, nullable: false, defaultValue: 'true', description: 'Account status' }
        );
        break;
      
      case 'product':
        columns.push(
          { name: 'name', type: stringType, nullable: false, length: 255, description: 'Product name' },
          { name: 'description', type: textType, nullable: true, description: 'Product description' },
          { name: 'price', type: 'DECIMAL', nullable: false, precision: 10, scale: 2, description: 'Product price' },
          { name: 'sku', type: stringType, nullable: false, length: 100, description: 'Stock keeping unit' },
          { name: 'stock_quantity', type: numberType, nullable: false, defaultValue: '0', description: 'Available stock' },
          { name: 'is_active', type: boolType, nullable: false, defaultValue: 'true', description: 'Product status' }
        );
        break;
      
      case 'order':
        columns.push(
          { name: 'order_number', type: stringType, nullable: false, length: 100, description: 'Order number' },
          { name: 'status', type: stringType, nullable: false, length: 50, description: 'Order status' },
          { name: 'total_amount', type: 'DECIMAL', nullable: false, precision: 10, scale: 2, description: 'Total amount' },
          { name: 'user_id', type: 'UUID', nullable: false, description: 'Customer ID' }
        );
        break;
      
      default:
        columns.push(
          { name: 'name', type: stringType, nullable: false, length: 255, description: `${entity} name` },
          { name: 'description', type: textType, nullable: true, description: `${entity} description` },
          { name: 'is_active', type: boolType, nullable: false, defaultValue: 'true', description: 'Status' }
        );
    }

    return columns;
  }

  private generateIndexesForTable(tableName: string, columns: ColumnDefinition[], database: DatabaseType): IndexDefinition[] {
    const indexes: IndexDefinition[] = [];

    // Add indexes for common searchable fields
    columns.forEach(column => {
      if (column.name === 'email' || column.name === 'username' || column.name === 'sku') {
        indexes.push({
          name: `idx_${tableName}_${column.name}`,
          columns: [column.name],
          unique: true,
          type: database.name === 'PostgreSQL' ? 'BTREE' : undefined
        });
      } else if (column.name.includes('_id') || column.name === 'status' || column.name === 'name') {
        indexes.push({
          name: `idx_${tableName}_${column.name}`,
          columns: [column.name],
          unique: false,
          type: database.name === 'PostgreSQL' ? 'BTREE' : undefined
        });
      }
    });

    return indexes;
  }

  private generateRelationships(relationshipDescriptions: string[], pattern: any): RelationshipDefinition[] {
    const relationships: RelationshipDefinition[] = [];
    
    // Generate relationships based on pattern
    if (pattern && pattern.relationships) {
      pattern.relationships.forEach((rel, index) => {
        relationships.push({
          id: `rel_${index}`,
          fromTable: rel.from.toLowerCase() + 's',
          fromColumn: 'id',
          toTable: rel.to.toLowerCase() + 's',
          toColumn: rel.from.toLowerCase() + '_id',
          type: rel.type,
          name: `${rel.from}_${rel.to}_relationship`
        });
      });
    }

    return relationships;
  }

  private generateViews(tables: TableSchema[], database: DatabaseType): ViewDefinition[] {
    const views: ViewDefinition[] = [];

    // Generate common views
    if (database.type === 'SQL') {
      // User summary view
      const userTable = tables.find(t => t.name === 'users');
      if (userTable) {
        views.push({
          name: 'user_summary',
          query: `
            SELECT 
              id,
              email,
              CONCAT(first_name, ' ', last_name) as full_name,
              is_active,
              created_at
            FROM users
            WHERE is_active = true
          `,
          description: 'Active users summary'
        });
      }

      // Product catalog view
      const productTable = tables.find(t => t.name === 'products');
      if (productTable) {
        views.push({
          name: 'product_catalog',
          query: `
            SELECT 
              p.id,
              p.name,
              p.description,
              p.price,
              p.stock_quantity,
              c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = true
          `,
          description: 'Active products with category information'
        });
      }
    }

    return views;
  }

  private generateFunctions(tables: TableSchema[], database: DatabaseType): FunctionDefinition[] {
    const functions: FunctionDefinition[] = [];

    if (database.name === 'PostgreSQL') {
      // Update timestamp function
      functions.push({
        name: 'update_updated_at_column',
        parameters: [],
        returnType: 'TRIGGER',
        language: 'plpgsql',
        body: `
          BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
          END;
        `
      });

      // User creation function
      const userTable = tables.find(t => t.name === 'users');
      if (userTable) {
        functions.push({
          name: 'create_user',
          parameters: [
            { name: 'p_email', type: 'VARCHAR' },
            { name: 'p_password', type: 'VARCHAR' },
            { name: 'p_first_name', type: 'VARCHAR', defaultValue: 'NULL' },
            { name: 'p_last_name', type: 'VARCHAR', defaultValue: 'NULL' }
          ],
          returnType: 'UUID',
          language: 'plpgsql',
          body: `
            DECLARE
              user_id UUID;
            BEGIN
              INSERT INTO users (email, password_hash, first_name, last_name)
              VALUES (p_email, crypt(p_password, gen_salt('bf')), p_first_name, p_last_name)
              RETURNING id INTO user_id;
              
              RETURN user_id;
            END;
          `
        });
      }
    }

    return functions;
  }

  generateSQLScript(schema: DatabaseSchema, database: DatabaseType): string {
    let sql = `-- Database Schema for ${schema.name}\n`;
    sql += `-- Generated for ${database.name}\n`;
    sql += `-- Generated on ${new Date().toISOString()}\n\n`;

    // Create tables
    schema.tables.forEach(table => {
      sql += this.generateCreateTableSQL(table, database);
      sql += '\n\n';
    });

    // Create indexes
    schema.tables.forEach(table => {
      table.indexes.forEach(index => {
        sql += this.generateCreateIndexSQL(table.name, index, database);
        sql += '\n';
      });
    });

    // Create foreign keys
    schema.relationships.forEach(rel => {
      sql += this.generateForeignKeySQL(rel, database);
      sql += '\n';
    });

    // Create views
    schema.views.forEach(view => {
      sql += `CREATE VIEW ${view.name} AS\n${view.query};\n\n`;
    });

    // Create functions
    schema.functions.forEach(func => {
      sql += this.generateFunctionSQL(func, database);
      sql += '\n\n';
    });

    return sql;
  }

  private generateCreateTableSQL(table: TableSchema, database: DatabaseType): string {
    let sql = `CREATE TABLE ${table.name} (\n`;
    
    const columnDefs = table.columns.map(col => {
      let def = `  ${col.name} ${col.type}`;
      
      if (col.length) def += `(${col.length})`;
      if (col.precision && col.scale) def += `(${col.precision}, ${col.scale})`;
      if (!col.nullable) def += ' NOT NULL';
      if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
      
      return def;
    });

    sql += columnDefs.join(',\n');
    
    if (table.primaryKey.length > 0) {
      sql += `,\n  PRIMARY KEY (${table.primaryKey.join(', ')})`;
    }

    sql += '\n);';

    // Add comments
    table.columns.forEach(col => {
      if (col.description) {
        sql += `\nCOMMENT ON COLUMN ${table.name}.${col.name} IS '${col.description}';`;
      }
    });

    return sql;
  }

  private generateCreateIndexSQL(tableName: string, index: IndexDefinition, database: DatabaseType): string {
    const unique = index.unique ? 'UNIQUE ' : '';
    const type = index.type ? ` USING ${index.type}` : '';
    return `CREATE ${unique}INDEX ${index.name} ON ${tableName}${type} (${index.columns.join(', ')});`;
  }

  private generateForeignKeySQL(relationship: RelationshipDefinition, database: DatabaseType): string {
    return `ALTER TABLE ${relationship.fromTable} 
ADD CONSTRAINT fk_${relationship.fromTable}_${relationship.toTable} 
FOREIGN KEY (${relationship.toColumn}) REFERENCES ${relationship.toTable}(${relationship.fromColumn});`;
  }

  private generateFunctionSQL(func: FunctionDefinition, database: DatabaseType): string {
    const params = func.parameters.map(p => 
      `${p.name} ${p.type}${p.defaultValue ? ` DEFAULT ${p.defaultValue}` : ''}`
    ).join(', ');

    return `CREATE OR REPLACE FUNCTION ${func.name}(${params})
RETURNS ${func.returnType}
LANGUAGE ${func.language}
AS $$${func.body}$$;`;
  }

  generateNoSQLSchema(schema: DatabaseSchema): any {
    const collections = {};

    schema.tables.forEach(table => {
      const collection = {
        name: table.name,
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: table.columns.filter(col => !col.nullable).map(col => col.name),
            properties: {}
          }
        },
        indexes: table.indexes.map(index => ({
          key: index.columns.reduce((acc, col) => ({ ...acc, [col]: 1 }), {}),
          unique: index.unique,
          name: index.name
        }))
      };

      table.columns.forEach(col => {
        collection.validator.$jsonSchema.properties[col.name] = {
          bsonType: this.mapSQLTypeToMongoDB(col.type),
          description: col.description
        };
      });

      collections[table.name] = collection;
    });

    return collections;
  }

  private mapSQLTypeToMongoDB(sqlType: string): string {
    const typeMap = {
      'VARCHAR': 'string',
      'TEXT': 'string',
      'INTEGER': 'int',
      'DECIMAL': 'decimal',
      'BOOLEAN': 'bool',
      'TIMESTAMP': 'date',
      'UUID': 'string'
    };

    return typeMap[sqlType] || 'string';
  }
}