import { collection, getDocs, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "firebaseConfig";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const style = {
    border: "1px solid green",
    margin: 12,
    padding: 8,
};

function ComponentTest() {
    // const [dataSource, setDataSource] = useState(Array.from({ length: 20 }));
    // const [hasMore, setHasMore] = useState(true);
    // const fetchMoreData = () => {
    //     if (dataSource.length < 200) {
    //         setTimeout(() => {
    //             setDataSource(dataSource.concat(Array.from({ length: 20 })));
    //         }, 500);
    //     } else {
    //         setHasMore(false);
    //     }
    // };

    const [room, setRoom] = useState([])
    const [messages, setMessages] = useState([])


    useEffect(() => {
        setMessages([]);
        let unSubcribe;
        if ("JdupBVIqbFJynsu1Tseg") {
            const handleSnapShotMessage = async () => {
                const messagesRef = query(
                    collection(db, "messages"),
                    where("roomId", "==", "JdupBVIqbFJynsu1Tseg"),
                    orderBy("createdAt", "desc"),
                    limit(10)
                );
                unSubcribe = onSnapshot(messagesRef, (docsSnap) => {
                    const documents = docsSnap.docs.map((doc) => {
                        const id = doc.id;
                        const data = doc.data();
                        return {
                            ...data,
                            id: id,
                        };
                    });
                    const newDocuments = [...documents].reverse();
                    setMessages((prev) => {
                        if (prev.length === 0) return newDocuments;
                        return prev;
                    });
                    setLastDoc(docsSnap.docs[docsSnap.docs.length - 1] || null);
                });
            };
            handleSnapShotMessage();
        }

        // const chatWindow = boxChatRef?.current;
        // setTimeout(() => {
        //   chatWindow.scrollTo({
        //     top: chatWindow.scrollHeight,
        //     behavior: "auto",
        //   });
        // }, 100);

        return () => unSubcribe && unSubcribe();
    }, [room.id]);


    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchMoreData = async () => {
        console.log("hihi");
        if (!hasMore) return;
        await loadMoreMessages();
    };

    const loadMoreMessages = async () => {
        if (!lastDoc) return;

        const messageRef = query(
            collection(db, "messages"),
            where("roomId", "==", "JdupBVIqbFJynsu1Tseg"),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(3)
        );
        console.log("adhsadhsadsa");

        const snap = await getDocs(messageRef);
        if (snap.empty) {
            setHasMore(false);
            return;
        }

        // Lấy docs mới, giữ nguyên desc rồi reverse để khớp với mảng hiện tại
        let newMessages = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        newMessages.reverse()

        // QUAN TRỌNG: Tin cũ tải thêm phải đưa lên ĐẦU mảng
        setMessages((prev) => [...newMessages.reverse(), ...prev]);

        // Cập nhật lastDoc là cái cũ nhất vừa lấy được (cái cuối cùng trong snap)
        setLastDoc(snap.docs[snap.docs.length - 1]);
    };

    return (
        <div >
            <p>
                Title: <b>InfiniteScroll Tutorial</b>
            </p>
            {/* <div id="parentScrollDiv" style={{ height: 500, overflow: "auto", padding: "0 16px", border: "3px solid #333" }}>
        <InfiniteScroll
          dataLength={dataSource.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>You are all set!</p>}
          height={500}
          scrollableTarget="parentScrollDiv"
        >
          {dataSource.map((item, index) => {
            return (
              <div key={index} style={style}>
                This is a div #{index + 1} inside InfiniteScroll
              </div>
            );
          })}
        </InfiniteScroll>
      </div> */}
            {/* REVERSE */}
            <div
                id="parentScrollDiv"
                style={{
                    height: 500,
                    overflow: "auto",
                    padding: "0 16px",
                    border: "3px solid #333",
                    display: "flex",
                    flexDirection: "column-reverse",
                }}
            >

                <InfiniteScroll
                    inverse={true}
                    dataLength={messages.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={<p>You are all set!</p>}
                    height={500}
                    scrollableTarget="parentScrollDiv"
                    style={{ display: "flex", flexDirection: "column-reverse" }}
                >


                    {messages.map((item, index) => {
                        return (
                            <div key={index} style={style}>
                                This is a div #{index + 1} inside InfiniteScroll
                            </div>
                        );
                    })}

                    <img src={require("assets/avatar-mac-dinh-1.png")} alt="" srcset="" style={{ width: 100 }} />
                    <div>something</div>
                    <div>something</div>
                    <div>something</div>
                </InfiniteScroll>

            </div>
        </div>
    );
}

export default ComponentTest;
