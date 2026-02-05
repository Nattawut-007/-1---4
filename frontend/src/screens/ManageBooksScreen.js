import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, RefreshControl, Modal } from 'react-native';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const ManageBooksScreen = () => {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    // Edit Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [editBookId, setEditBookId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editAuthor, setEditAuthor] = useState('');

    const fetchBooks = async () => {
        try {
            const response = await api.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBooks();
        }, [])
    );

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchBooks();
        setRefreshing(false);
    }, []);

    const handleAddBook = async () => {
        if (!title || !author) {
            Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        try {
            await api.post('/books', { title, author });
            Alert.alert('สำเร็จ', 'เพิ่มหนังสือเรียบร้อยแล้ว');
            setTitle('');
            setAuthor('');
            fetchBooks();
        } catch (error) {
            Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเพิ่มหนังสือได้');
        }
    };

    const handleDeleteBook = async (id) => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบ",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/books/${id}`);
                            Alert.alert('สำเร็จ', 'ลบหนังสือเรียบร้อยแล้ว');
                            fetchBooks();
                        } catch (error) {
                            Alert.alert('ข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถลบหนังสือได้');
                        }
                    }
                }
            ]
        );
    };

    const openEditModal = (book) => {
        setEditBookId(book._id);
        setEditTitle(book.title);
        setEditAuthor(book.author);
        setModalVisible(true);
    };

    const handleUpdateBook = async () => {
        if (!editTitle || !editAuthor) {
            Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        try {
            await api.put(`/books/${editBookId}`, { title: editTitle, author: editAuthor });
            Alert.alert('สำเร็จ', 'แก้ไขหนังสือเรียบร้อยแล้ว');
            setModalVisible(false);
            fetchBooks();
        } catch (error) {
            Alert.alert('ข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถแก้ไขหนังสือได้');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>📚 {item.title}</Text>
                <Text style={styles.bookAuthor}>ผู้แต่ง: {item.author}</Text>
                <Text style={[styles.status, item.status === 'available' ? styles.statusAvailable : styles.statusBorrowed]}>
                    สถานะ: {item.status === 'available' ? 'ว่าง' : 'ถูกยืม'}
                </Text>
            </View>
            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
                    <Text style={styles.editButtonText}>แก้ไข</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteBook(item._id)}>
                    <Text style={styles.deleteButtonText}>ลบ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.formCard}>
                <Text style={styles.formHeader}>เพิ่มหนังสือใหม่</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ชื่อหนังสือ"
                    value={title}
                    onChangeText={setTitle}
                />
                <TextInput
                    style={styles.input}
                    placeholder="ชื่อผู้แต่ง"
                    value={author}
                    onChangeText={setAuthor}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
                    <Text style={styles.addButtonText}>ยืนยันการเพิ่ม</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.listHeader}>รายการหนังสือทั้งหมด</Text>
            <FlatList
                data={books}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />

            {/* Edit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalCenteredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>แก้ไขข้อมูลหนังสือ</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="ชื่อหนังสือ"
                            value={editTitle}
                            onChangeText={setEditTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="ชื่อผู้แต่ง"
                            value={editAuthor}
                            onChangeText={setEditAuthor}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.textStyle}>ยกเลิก</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleUpdateBook}>
                                <Text style={styles.textStyle}>บันทึก</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },

    formCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    formHeader: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#e0e0e0', padding: 12, marginBottom: 15, borderRadius: 8, backgroundColor: '#f9f9f9', fontSize: 16 },

    addButton: { backgroundColor: '#27ae60', padding: 15, borderRadius: 8, alignItems: 'center' },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    listHeader: { fontSize: 18, fontWeight: 'bold', color: '#34495e', marginBottom: 10, marginLeft: 5 },

    card: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 12, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
    bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
    bookAuthor: { fontSize: 14, color: '#7f8c8d', marginBottom: 4 },
    status: { fontSize: 14, fontWeight: 'bold' },
    statusAvailable: { color: '#27ae60' },
    statusBorrowed: { color: '#e74c3c' },

    actionButtons: { flexDirection: 'column', gap: 5 },
    editButton: { backgroundColor: '#f39c12', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6, marginBottom: 5 },
    editButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
    deleteButton: { backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6 },
    deleteButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },

    // Modal Styles
    modalCenteredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { width: '90%', margin: 20, backgroundColor: "white", borderRadius: 20, padding: 35, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
    modalTitle: { marginBottom: 15, textAlign: "center", fontSize: 20, fontWeight: "bold" },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
    button: { borderRadius: 10, padding: 10, elevation: 2, minWidth: 100 },
    buttonClose: { backgroundColor: "#95a5a6" },
    buttonSave: { backgroundColor: "#3498db" },
    textStyle: { color: "white", fontWeight: "bold", textAlign: "center" }
});

export default ManageBooksScreen;
