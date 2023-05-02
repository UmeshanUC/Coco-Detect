let selectedFile = DUMMY_COCO;
const BASE_URL = "https://192ab4b1-2793-4ff2-a22e-86b0a69455d9.mock.pstmn.io"
// const BASE_URL = "http://localhost:5000"


const onImageSelect = () => {

    selectedFile = $("#upload-file-input").get(0).files[0];

    if (selectedFile) {
        updateUploadPrev()
        enableUpload()
    }
}

const enableUpload = () => {
    $("#btn-upload").removeClass("disabled");
}

const disableUpload = () => {
    $("#btn-upload").addClass("disabled");
}

const onUploadClick = () => {
    let formData = new FormData();
    formData.append('image', selectedFile);
    setUploadBtnState(true)
    axios.post(BASE_URL + "/predict/1", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        onPredictSuccess(res);
        setUploadBtnState(false)

    }).catch(err => {
        setUploadBtnState(false)
        onPredictFailed(err)
    });
}

const setUploadBtnState = (isPending) => {
    if (isPending) {
        $("#btn-upload").html("<span class=\"spinner-border spinner-border-sm\" role=\"status\" aria-hidden=\"true\"></span>\n" + "  Loading...")
    } else {
        $("#btn-upload").html("Upload Image<i id=\"btn-upload-icon\" class=\"ms-2 bi-upload\"></i>")
    }
}

const processResult = (result) => {
    const processedResult = {icon: "", text: "", type: "", isReady: false};

    if (String(result).includes("Bunch")) {
        processedResult.type = "Bunch"
    } else {
        processedResult.type = "Single"
    }

    if (String(result).includes("Mature")) {
        processedResult.icon = "assets\\img\\ready.png"
        processedResult.text = "Ready for harvesting"
        processedResult.isReady = true
    } else {
        processedResult.icon = "assets\\img\\not-ready.png"
        processedResult.text = "Not ready for harvesting"
    }

    return processedResult;
}

const onPredictSuccess = (res) => {
    disableUpload();

    const pr = processResult(res.data.class);

    showModal("Prediction Result", pr.icon, URL.createObjectURL(selectedFile), pr.text, pr.type, pr.isReady);

    selectedFile = null;
    $("#upload-file-input").val("");

    updateUploadPrev()
}

const onPredictFailed = (err) => {
    showModal("Some Error !", "assets\\img\\not-ready.png", "", err.message, 'error')
}

const showModal = (title, resultIcon, image, text, type, isReady) => {
    $("#res-modal-title").html(title)
    if (isReady) {
        $("#res-modal-text-wrapper").addClass("border-success")
    } else {
        $("#res-modal-text-wrapper").removeClass("border-danger")

    }
    $("#res-modal-text").html(text)
    $("#res-modal-body").show();
    $("#res-modal-result-type").show();

    if (type === "error") {
        $("#res-modal-body").hide();
        $("#res-modal-result-type").hide();
        $("#res-modal-result-icon").attr("src", "assets\\img\\error.png")

        $("#response-modal").modal("show")
        return;
    }

    $("#res-modal-result-icon").attr("src", resultIcon)
    $("#res-modal-image").attr("src", image)
    $("#res-modal-result-type").html(type)

    $("#response-modal").modal("show")

}

updateUploadPrev = () => {
    if (selectedFile) $("#img-prev").attr("src", URL.createObjectURL(selectedFile)); else $("#img-prev").attr("src", DUMMY_COCO);
}


