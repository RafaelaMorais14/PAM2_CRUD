import React, { useRef } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db;
const App = () => {
    const editarClique = useRef(0);
    const deletarClique = useRef(0);
    async function Banco() {
        db = await SQLite.openDatabaseAsync('PAM2');
        if (db) {
            console.log("Banco criado");
            return db;
        }
        else {
            console.log("Erro ao criar Banco");
        }


    }

    async function CriarTabela() {

        db = await Banco();

        try {
            await db.execAsync(`
                PRAGMA journal_mode = WAL;
                CREATE TABLE IF NOT EXISTS TB_USUARIO (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 nome TEXT NOT NULL);`
            )
            console.log("tabela criada")
        } catch (erro) {
            console.log("Erro")
        }


    }

    async function Inserir() {
        db = await Banco();
        try {
            db.execAsync(
                ` INSERT INTO TB_USUARIO (nome)
                   VALUES ('Ricardo'),
                          ('Zé Matraca'),
                          ('Maria ');                          
                 `
            );
            console.log('Inserido');

        } catch (erro) {
            console.log('Erro' + erro)
        }


    }

    async function Exibir() {
        db = await Banco();
        const allRows = await db.getAllAsync('SELECT * FROM tb_usuario');
        for (const row of allRows) {
            console.log(row.id, row.nome);
        }
    }


    async function Editar() {
        const db = await Banco();
        editarClique.current++;

        const id = 1;
        const novoNome = editarClique.current === 1 ? "Luiz" : "Rodrigo";

        try {
            await db.runAsync(
                `UPDATE TB_USUARIO SET nome = ? WHERE id = ?`,
                novoNome,
                id
            );
            console.log(`Editado: ID ${id} -> ${novoNome}`);
        } catch (erro) {
            console.log("Erro ao editar:", erro);
        }
    }

    async function Deletar() {
        const db = await Banco();
        deletarClique.current++;

        const id = deletarClique.current === 1 ? 2 : 3;

        try {
            await db.runAsync(
                `DELETE FROM TB_USUARIO WHERE id = ?`,
                id
            );
            console.log(`Deletado: ID ${id}`);
        } catch (erro) {
            console.log("Erro ao deletar:", erro);
        }
    }
    async function DropTabela() {
    const db = await Banco();
}

    return (
        <View style={styles.container}>
            <CustomButton title="Criar Tabela" onPress={CriarTabela} />
            <CustomButton title="Inserir Dados" onPress={Inserir} />
            <CustomButton title="Exibir Dados" onPress={Exibir} />
            <CustomButton title="Editar" onPress={Editar} />
            <CustomButton title="Deletar (ID 2 / ID 3)" onPress={Deletar} />
        </View>
    );
};

const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        padding: 20,
        alignItems: 'center',
        gap: 25,
    },
    btn: {
        backgroundColor: '#a207ad',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 20,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default App;
