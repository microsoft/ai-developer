package com.sk.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.microsoft.semantickernel.data.vectorstorage.annotations.VectorStoreRecordData;
import com.microsoft.semantickernel.data.vectorstorage.annotations.VectorStoreRecordKey;
import com.microsoft.semantickernel.data.vectorstorage.annotations.VectorStoreRecordVector;
import com.microsoft.semantickernel.data.vectorstorage.definition.DistanceFunction;
import com.microsoft.semantickernel.data.vectorstorage.definition.IndexKind;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

public class Handbook {
    @VectorStoreRecordKey
    private String chunk_id;
    @VectorStoreRecordData
    private String parent_id;
    @VectorStoreRecordData
    private String chunk;
    @VectorStoreRecordData
    private String title;

    public String getChunk_id() {
        return chunk_id;
    }

    public void setChunk_id(String chunk_id) {
        this.chunk_id = chunk_id;
    }

    public String getParent_id() {
        return parent_id;
    }

    public void setParent_id(String parent_id) {
        this.parent_id = parent_id;
    }

    public String getChunk() {
        return chunk;
    }

    public void setChunk(String chunk) {
        this.chunk = chunk;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Float> getText_vector() {
        return text_vector;
    }

    public void setText_vector(List<Float> text_vector) {
        this.text_vector = text_vector;
    }

    /*@VectorStoreRecordDataAttribute
        private String chunk_id;
        @VectorStoreRecordDataAttribute
        private String last_updated;*/
    @VectorStoreRecordVector(dimensions = 1536, indexKind = IndexKind.HNSW, distanceFunction = DistanceFunction.COSINE_DISTANCE)
    private List<Float> text_vector;

    public Handbook() {
        this(null, null, null, null, null, /*null, null,*/ Collections.emptyList());
    }

    public Handbook(@JsonProperty String chunk_id, @JsonProperty String parent_id, @JsonProperty String chunk,
                    @JsonProperty String title, @JsonProperty String id,/* @JsonProperty String chunk_id,
                      @JsonProperty String last_updated,*/ @JsonProperty List<Float> text_vector) {
        this.chunk_id = chunk_id;
        this.parent_id = parent_id;
        this.chunk = chunk;
        this.title = title;
        this.text_vector = text_vector;
    }

    static String encodeId(String realId) {
        byte[] bytes = Base64.getUrlEncoder().encode(realId.getBytes(StandardCharsets.UTF_8));
        return new String(bytes, StandardCharsets.UTF_8);
    }
}
