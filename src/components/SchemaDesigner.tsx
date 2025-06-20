import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Database, 
  Table, 
  Key, 
  Link,
  Download,
  Eye,
  Code
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AISchemaDesignService, 
  DatabaseSchema, 
  TableSchema, 
  ColumnDefinition,
  RelationshipDefinition 
} from '@/services/aiSchemaDesignService';
import { DatabaseType } from '@/types/database';

interface SchemaDesignerProps {
  database: DatabaseType;
  initialSchema?: DatabaseSchema;
  onSchemaChange?: (schema: DatabaseSchema) => void;
}

export const SchemaDesigner = ({ database, initialSchema, onSchemaChange }: SchemaDesignerProps) => {
  const [schema, setSchema] = useState<DatabaseSchema>(initialSchema || {
    name: 'new_database',
    tables: [],
    relationships: [],
    views: [],
    functions: []
  });
  
  const [selectedTable, setSelectedTable] = useState<TableSchema | null>(null);
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [isAddingRelationship, setIsAddingRelationship] = useState(false);
  const [showSQLPreview, setShowSQLPreview] = useState(false);
  
  const schemaService = new AISchemaDesignService();

  const addTable = useCallback((tableName: string) => {
    const newTable: TableSchema = {
      name: tableName,
      columns: [
        {
          name: 'id',
          type: database.type === 'SQL' ? 'UUID' : 'ObjectId',
          nullable: false,
          defaultValue: database.type === 'SQL' ? 'gen_random_uuid()' : undefined,
          description: 'Primary key'
        }
      ],
      primaryKey: ['id'],
      foreignKeys: [],
      indexes: [],
      constraints: []
    };

    setSchema(prev => ({
      ...prev,
      tables: [...prev.tables, newTable]
    }));
    setIsAddingTable(false);
  }, [database.type]);

  const updateTable = useCallback((updatedTable: TableSchema) => {
    setSchema(prev => ({
      ...prev,
      tables: prev.tables.map(table => 
        table.name === updatedTable.name ? updatedTable : table
      )
    }));
    setSelectedTable(updatedTable);
  }, []);

  const deleteTable = useCallback((tableName: string) => {
    setSchema(prev => ({
      ...prev,
      tables: prev.tables.filter(table => table.name !== tableName),
      relationships: prev.relationships.filter(rel => 
        rel.fromTable !== tableName && rel.toTable !== tableName
      )
    }));
    if (selectedTable?.name === tableName) {
      setSelectedTable(null);
    }
  }, [selectedTable]);

  const addColumn = useCallback((column: ColumnDefinition) => {
    if (!selectedTable) return;

    const updatedTable = {
      ...selectedTable,
      columns: [...selectedTable.columns, column]
    };
    updateTable(updatedTable);
    setIsAddingColumn(false);
  }, [selectedTable, updateTable]);

  const updateColumn = useCallback((columnIndex: number, updatedColumn: ColumnDefinition) => {
    if (!selectedTable) return;

    const updatedTable = {
      ...selectedTable,
      columns: selectedTable.columns.map((col, index) => 
        index === columnIndex ? updatedColumn : col
      )
    };
    updateTable(updatedTable);
  }, [selectedTable, updateTable]);

  const deleteColumn = useCallback((columnIndex: number) => {
    if (!selectedTable) return;

    const updatedTable = {
      ...selectedTable,
      columns: selectedTable.columns.filter((_, index) => index !== columnIndex)
    };
    updateTable(updatedTable);
  }, [selectedTable, updateTable]);

  const addRelationship = useCallback((relationship: RelationshipDefinition) => {
    setSchema(prev => ({
      ...prev,
      relationships: [...prev.relationships, relationship]
    }));
    setIsAddingRelationship(false);
  }, []);

  const generateSQL = useCallback(() => {
    return schemaService.generateSQLScript(schema, database);
  }, [schema, database, schemaService]);

  const exportSchema = useCallback(() => {
    const sql = generateSQL();
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schema.name}_schema.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateSQL, schema.name]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Tables List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Tables
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setIsAddingTable(true)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {schema.tables.map((table) => (
                <div
                  key={table.name}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTable?.name === table.name
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedTable(table)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      <span className="font-medium">{table.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTable(table.name);
                      }}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {table.columns.length} columns
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Table Details */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {selectedTable ? (
                <>
                  <Table className="h-5 w-5" />
                  {selectedTable.name}
                </>
              ) : (
                <>
                  <Edit className="h-5 w-5" />
                  Schema Designer
                </>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={showSQLPreview} onOpenChange={setShowSQLPreview}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview SQL
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>SQL Schema Preview</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh]">
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      <code>{generateSQL()}</code>
                    </pre>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              <Button size="sm" onClick={exportSchema}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedTable ? (
            <div className="space-y-6">
              {/* Columns */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Columns</h3>
                  <Button
                    size="sm"
                    onClick={() => setIsAddingColumn(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedTable.columns.map((column, index) => (
                    <ColumnEditor
                      key={index}
                      column={column}
                      database={database}
                      onUpdate={(updatedColumn) => updateColumn(index, updatedColumn)}
                      onDelete={() => deleteColumn(index)}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Relationships */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Relationships</h3>
                  <Button
                    size="sm"
                    onClick={() => setIsAddingRelationship(true)}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Add Relationship
                  </Button>
                </div>
                <div className="space-y-2">
                  {schema.relationships
                    .filter(rel => rel.fromTable === selectedTable.name || rel.toTable === selectedTable.name)
                    .map((relationship, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          <span className="text-sm">
                            {relationship.fromTable} → {relationship.toTable}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {relationship.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-center">
              <div>
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Design Your Database Schema</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a table from the left panel to edit its structure, or create a new table to get started.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddTableDialog
        open={isAddingTable}
        onOpenChange={setIsAddingTable}
        onAdd={addTable}
      />

      <AddColumnDialog
        open={isAddingColumn}
        onOpenChange={setIsAddingColumn}
        database={database}
        onAdd={addColumn}
      />

      <AddRelationshipDialog
        open={isAddingRelationship}
        onOpenChange={setIsAddingRelationship}
        tables={schema.tables}
        onAdd={addRelationship}
      />
    </div>
  );
};

// Column Editor Component
interface ColumnEditorProps {
  column: ColumnDefinition;
  database: DatabaseType;
  onUpdate: (column: ColumnDefinition) => void;
  onDelete: () => void;
}

const ColumnEditor = ({ column, database, onUpdate, onDelete }: ColumnEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedColumn, setEditedColumn] = useState(column);

  const handleSave = () => {
    onUpdate(editedColumn);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedColumn(column);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-3 border rounded-lg space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="column-name">Name</Label>
            <Input
              id="column-name"
              value={editedColumn.name}
              onChange={(e) => setEditedColumn(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="column-type">Type</Label>
            <Select
              value={editedColumn.type}
              onValueChange={(value) => setEditedColumn(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {database.type === 'SQL' ? (
                  <>
                    <SelectItem value="VARCHAR">VARCHAR</SelectItem>
                    <SelectItem value="TEXT">TEXT</SelectItem>
                    <SelectItem value="INTEGER">INTEGER</SelectItem>
                    <SelectItem value="DECIMAL">DECIMAL</SelectItem>
                    <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                    <SelectItem value="TIMESTAMP">TIMESTAMP</SelectItem>
                    <SelectItem value="UUID">UUID</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="String">String</SelectItem>
                    <SelectItem value="Number">Number</SelectItem>
                    <SelectItem value="Boolean">Boolean</SelectItem>
                    <SelectItem value="Date">Date</SelectItem>
                    <SelectItem value="ObjectId">ObjectId</SelectItem>
                    <SelectItem value="Array">Array</SelectItem>
                    <SelectItem value="Object">Object</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="nullable"
              checked={editedColumn.nullable}
              onCheckedChange={(checked) => 
                setEditedColumn(prev => ({ ...prev, nullable: checked as boolean }))
              }
            />
            <Label htmlFor="nullable">Nullable</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={editedColumn.description || ''}
            onChange={(e) => setEditedColumn(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Column description"
          />
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>Save</Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {column.name === 'id' && <Key className="h-3 w-3 text-yellow-600" />}
          <span className="font-medium">{column.name}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {column.type}
        </Badge>
        {!column.nullable && (
          <Badge variant="outline" className="text-xs text-red-600">
            NOT NULL
          </Badge>
        )}
      </div>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-6 w-6 p-0"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

// Add Table Dialog
interface AddTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (tableName: string) => void;
}

const AddTableDialog = ({ open, onOpenChange, onAdd }: AddTableDialogProps) => {
  const [tableName, setTableName] = useState('');

  const handleAdd = () => {
    if (tableName.trim()) {
      onAdd(tableName.trim());
      setTableName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="table-name">Table Name</Label>
            <Input
              id="table-name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Enter table name"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={!tableName.trim()}>
              Add Table
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Add Column Dialog
interface AddColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  database: DatabaseType;
  onAdd: (column: ColumnDefinition) => void;
}

const AddColumnDialog = ({ open, onOpenChange, database, onAdd }: AddColumnDialogProps) => {
  const [column, setColumn] = useState<ColumnDefinition>({
    name: '',
    type: database.type === 'SQL' ? 'VARCHAR' : 'String',
    nullable: true,
    description: ''
  });

  const handleAdd = () => {
    if (column.name.trim()) {
      onAdd(column);
      setColumn({
        name: '',
        type: database.type === 'SQL' ? 'VARCHAR' : 'String',
        nullable: true,
        description: ''
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              value={column.name}
              onChange={(e) => setColumn(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter column name"
            />
          </div>
          <div>
            <Label htmlFor="column-type">Data Type</Label>
            <Select
              value={column.type}
              onValueChange={(value) => setColumn(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {database.type === 'SQL' ? (
                  <>
                    <SelectItem value="VARCHAR">VARCHAR</SelectItem>
                    <SelectItem value="TEXT">TEXT</SelectItem>
                    <SelectItem value="INTEGER">INTEGER</SelectItem>
                    <SelectItem value="DECIMAL">DECIMAL</SelectItem>
                    <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                    <SelectItem value="TIMESTAMP">TIMESTAMP</SelectItem>
                    <SelectItem value="UUID">UUID</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="String">String</SelectItem>
                    <SelectItem value="Number">Number</SelectItem>
                    <SelectItem value="Boolean">Boolean</SelectItem>
                    <SelectItem value="Date">Date</SelectItem>
                    <SelectItem value="ObjectId">ObjectId</SelectItem>
                    <SelectItem value="Array">Array</SelectItem>
                    <SelectItem value="Object">Object</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="nullable"
              checked={column.nullable}
              onCheckedChange={(checked) => 
                setColumn(prev => ({ ...prev, nullable: checked as boolean }))
              }
            />
            <Label htmlFor="nullable">Allow NULL values</Label>
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={column.description || ''}
              onChange={(e) => setColumn(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Column description"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={!column.name.trim()}>
              Add Column
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Add Relationship Dialog
interface AddRelationshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tables: TableSchema[];
  onAdd: (relationship: RelationshipDefinition) => void;
}

const AddRelationshipDialog = ({ open, onOpenChange, tables, onAdd }: AddRelationshipDialogProps) => {
  const [relationship, setRelationship] = useState<Partial<RelationshipDefinition>>({
    type: 'ONE_TO_MANY'
  });

  const handleAdd = () => {
    if (relationship.fromTable && relationship.toTable && relationship.fromColumn && relationship.toColumn) {
      onAdd({
        id: `rel_${Date.now()}`,
        fromTable: relationship.fromTable,
        fromColumn: relationship.fromColumn,
        toTable: relationship.toTable,
        toColumn: relationship.toColumn,
        type: relationship.type as any,
        name: `${relationship.fromTable}_${relationship.toTable}_relationship`
      });
      setRelationship({ type: 'ONE_TO_MANY' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Relationship</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>From Table</Label>
              <Select
                value={relationship.fromTable || ''}
                onValueChange={(value) => setRelationship(prev => ({ ...prev, fromTable: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map(table => (
                    <SelectItem key={table.name} value={table.name}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>To Table</Label>
              <Select
                value={relationship.toTable || ''}
                onValueChange={(value) => setRelationship(prev => ({ ...prev, toTable: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map(table => (
                    <SelectItem key={table.name} value={table.name}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Relationship Type</Label>
            <Select
              value={relationship.type || 'ONE_TO_MANY'}
              onValueChange={(value) => setRelationship(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONE_TO_ONE">One to One</SelectItem>
                <SelectItem value="ONE_TO_MANY">One to Many</SelectItem>
                <SelectItem value="MANY_TO_MANY">Many to Many</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={!relationship.fromTable || !relationship.toTable}>
              Add Relationship
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};